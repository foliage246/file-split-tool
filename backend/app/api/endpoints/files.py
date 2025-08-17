from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks, Form
from fastapi.responses import FileResponse
from typing import Optional
import os
import json
import uuid
from datetime import datetime

from ...core.config import settings
from ...core.redis_client import get_redis_client
from ...core.dependencies import get_current_user
from ...services.file_processor import FileProcessor
from ...utils.file_utils import is_supported_file_type, get_file_size_mb, validate_file_size
from ...models.task import TaskStatus, ProcessingTask
from ...models.user import User

router = APIRouter()


@router.post("/upload")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    column_name: str = Form(...),
    batch_size: Optional[int] = Form(None),
    user: User = Depends(get_current_user),
    redis_client = Depends(get_redis_client)
):
    """
    上傳檔案並開始處理
    
    Args:
        file: 上傳的檔案
        column_name: 要切分的欄位名稱
        batch_size: 每個批次的最大行數（可選）
        user: 當前用戶
    
    Returns:
        任務 ID 和初始狀態
    """
    try:
        # 檢查檔案類型
        if not is_supported_file_type(file.filename):
            raise HTTPException(
                status_code=400,
                detail="不支援的檔案類型。支援格式: CSV, Excel (.xlsx, .xls), TXT"
            )
        
        # 檢查檔案大小
        file_content = await file.read()
        file_size_mb = len(file_content) / (1024 * 1024)
        
        # 根據用戶類型檢查檔案大小限制
        max_size = settings.PREMIUM_FILE_SIZE_LIMIT if user.is_premium else settings.FREE_FILE_SIZE_LIMIT
        if file_size_mb > max_size:
            raise HTTPException(
                status_code=413,
                detail=f"檔案過大。{'付費版' if user.is_premium else '免費版'}最大支援 {max_size}MB"
            )
        
        # 檢查每日處理限制
        today = datetime.now().strftime("%Y-%m-%d")
        usage_key = f"daily_usage:{user.user_id}:{today}"
        current_usage = await redis_client.get(usage_key) or 0
        current_usage = int(current_usage)
        
        daily_limit = settings.PREMIUM_DAILY_LIMIT if user.is_premium else settings.FREE_DAILY_LIMIT
        if current_usage >= daily_limit:
            raise HTTPException(
                status_code=429,
                detail=f"已達每日處理限制。{'付費版' if user.is_premium else '免費版'}每日可處理 {daily_limit} 個檔案"
            )
        
        # 重置檔案指針
        await file.seek(0)
        
        # 生成任務 ID
        task_id = str(uuid.uuid4())
        
        # 創建處理任務
        task = ProcessingTask(
            task_id=task_id,
            user_id=user.user_id,
            filename=file.filename,
            file_size_mb=round(file_size_mb, 2),
            column_name=column_name,
            status=TaskStatus.PENDING,
            created_at=datetime.now()
        )
        
        # 儲存任務到 Redis
        await redis_client.setex(
            f"task:{task_id}",
            3600,  # 1小時過期
            json.dumps(task.dict(), default=str)
        )
        
        # 更新每日使用量
        await redis_client.incr(usage_key)
        await redis_client.expire(usage_key, 86400)  # 24小時過期
        
        # 啟動背景處理
        background_tasks.add_task(process_file_background, task_id, file, column_name, batch_size)
        
        return {
            "task_id": task_id,
            "status": TaskStatus.PENDING,
            "message": "檔案上傳成功，開始處理中..."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"檔案上傳失敗: {str(e)}")


@router.post("/split/{task_id}")
async def start_split_task(
    task_id: str,
    column_name: str,
    batch_size: Optional[int] = None,
    user: User = Depends(get_current_user),
    redis_client = Depends(get_redis_client)
):
    """
    手動啟動檔案切分任務
    
    Args:
        task_id: 任務 ID
        column_name: 要切分的欄位名稱
        batch_size: 每個批次的最大行數（可選）
        user: 當前用戶
    
    Returns:
        處理狀態
    """
    try:
        # 獲取任務資訊
        task_data = await redis_client.get(f"task:{task_id}")
        if not task_data:
            raise HTTPException(status_code=404, detail="任務不存在或已過期")
        
        task_dict = json.loads(task_data)
        
        # 檢查任務擁有者
        if task_dict.get("user_id") != user.user_id:
            raise HTTPException(status_code=403, detail="無權訪問此任務")
        
        # 檢查任務狀態
        if task_dict.get("status") != TaskStatus.UPLOADED:
            raise HTTPException(status_code=400, detail="任務狀態不正確，無法開始切分")
        
        # 更新任務狀態
        task_dict["status"] = TaskStatus.PROCESSING
        task_dict["column_name"] = column_name
        task_dict["batch_size"] = batch_size
        task_dict["updated_at"] = datetime.now().isoformat()
        
        await redis_client.setex(
            f"task:{task_id}",
            3600,
            json.dumps(task_dict, default=str)
        )
        
        # 啟動背景處理（這裡應該有實際的檔案處理邏輯）
        # background_tasks.add_task(process_split_background, task_id)
        
        return {
            "task_id": task_id,
            "status": TaskStatus.PROCESSING,
            "message": "切分任務已啟動"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"啟動切分任務失敗: {str(e)}")


@router.get("/status/{task_id}")
async def get_task_status(
    task_id: str,
    user: User = Depends(get_current_user),
    redis_client = Depends(get_redis_client)
):
    """
    查詢任務處理狀態
    
    Args:
        task_id: 任務 ID
        user: 當前用戶
    
    Returns:
        任務狀態和處理進度
    """
    try:
        # 獲取任務資訊
        task_data = await redis_client.get(f"task:{task_id}")
        if not task_data:
            raise HTTPException(status_code=404, detail="任務不存在或已過期")
        
        task_dict = json.loads(task_data)
        
        # 檢查任務擁有者
        if task_dict.get("user_id") != user.user_id:
            raise HTTPException(status_code=403, detail="無權訪問此任務")
        
        # 獲取處理結果（如果有）
        result_data = await redis_client.get(f"result:{task_id}")
        result = json.loads(result_data) if result_data else None
        
        response = {
            "task_id": task_id,
            "status": task_dict.get("status"),
            "filename": task_dict.get("filename"),
            "file_size_mb": task_dict.get("file_size_mb"),
            "column_name": task_dict.get("column_name"),
            "batch_size": task_dict.get("batch_size"),
            "created_at": task_dict.get("created_at"),
            "updated_at": task_dict.get("updated_at"),
            "error_message": task_dict.get("error_message")
        }
        
        if result:
            response.update({
                "total_rows": result.get("total_rows"),
                "split_groups": result.get("split_groups"),
                "output_files": result.get("output_files"),
                "file_details": result.get("file_details")
            })
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"查詢任務狀態失敗: {str(e)}")


@router.get("/download/{task_id}")
async def download_result(
    task_id: str,
    user: User = Depends(get_current_user),
    redis_client = Depends(get_redis_client)
):
    """
    下載處理結果
    
    Args:
        task_id: 任務 ID
        user: 當前用戶
    
    Returns:
        處理結果檔案
    """
    try:
        # 獲取任務資訊
        task_data = await redis_client.get(f"task:{task_id}")
        if not task_data:
            raise HTTPException(status_code=404, detail="任務不存在或已過期")
        
        task_dict = json.loads(task_data)
        
        # 檢查任務擁有者
        if task_dict.get("user_id") != user.user_id:
            raise HTTPException(status_code=403, detail="無權訪問此任務")
        
        # 檢查任務是否完成
        if task_dict.get("status") != TaskStatus.COMPLETED:
            raise HTTPException(status_code=400, detail="任務尚未完成，無法下載")
        
        # 獲取結果檔案路徑
        result_data = await redis_client.get(f"result:{task_id}")
        if not result_data:
            raise HTTPException(status_code=404, detail="處理結果不存在")
        
        result = json.loads(result_data)
        zip_path = result.get("zip_path")
        
        if not zip_path or not os.path.exists(zip_path):
            raise HTTPException(status_code=404, detail="結果檔案不存在")
        
        # 返回檔案
        original_filename = task_dict.get("filename", "unknown")
        download_filename = f"{original_filename}_split_results.zip"
        
        return FileResponse(
            path=zip_path,
            filename=download_filename,
            media_type="application/zip"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"下載檔案失敗: {str(e)}")


async def process_file_background(
    task_id: str,
    file: UploadFile,
    column_name: str,
    batch_size: Optional[int] = None
):
    """
    背景處理檔案切分任務
    
    Args:
        task_id: 任務 ID
        file: 上傳的檔案
        column_name: 要切分的欄位名稱
        batch_size: 每個批次的最大行數（可選）
    """
    redis_client = get_redis_client()
    processor = FileProcessor()
    
    print(f"🚀 開始處理任務: {task_id}, 檔案: {file.filename}, 欄位: {column_name}")
    
    try:
        # 更新任務狀態為處理中
        task_data = await redis_client.get(f"task:{task_id}")
        task_dict = json.loads(task_data)
        task_dict["status"] = TaskStatus.PROCESSING
        task_dict["updated_at"] = datetime.now().isoformat()
        
        await redis_client.setex(
            f"task:{task_id}",
            3600,
            json.dumps(task_dict, default=str)
        )
        
        # 執行檔案處理
        result = await processor.process_file(file, column_name, batch_size)
        
        if result["success"]:
            # 更新任務狀態為完成
            task_dict["status"] = TaskStatus.COMPLETED
            task_dict["updated_at"] = datetime.now().isoformat()
            
            # 儲存處理結果
            await redis_client.setex(
                f"result:{task_id}",
                3600,
                json.dumps(result, default=str)
            )
        else:
            # 處理失敗
            print(f"❌ 處理失敗: {result}")
            task_dict["status"] = TaskStatus.ERROR
            task_dict["error_message"] = result.get("error", "處理失敗")
            task_dict["updated_at"] = datetime.now().isoformat()
        
        # 更新任務狀態
        await redis_client.setex(
            f"task:{task_id}",
            3600,
            json.dumps(task_dict, default=str)
        )
        
    except Exception as e:
        # 處理異常
        print(f"💥 背景任務異常: {task_id}, 錯誤: {str(e)}")
        
        try:
            task_data = await redis_client.get(f"task:{task_id}")
            if task_data:
                task_dict = json.loads(task_data)
                task_dict["status"] = TaskStatus.ERROR
                task_dict["error_message"] = str(e)
                task_dict["updated_at"] = datetime.now().isoformat()
                
                await redis_client.setex(
                    f"task:{task_id}",
                    3600,
                    json.dumps(task_dict, default=str)
                )
        except Exception as redis_error:
            print(f"💥 Redis 更新錯誤: {str(redis_error)}")
    
    finally:
        # 清理資源
        processor.cleanup()

