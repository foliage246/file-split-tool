from fastapi import APIRouter, HTTPException, Depends, Request, Header
from typing import Optional
import json
from datetime import datetime

from ...core.config import settings
from ...core.redis_client import get_redis_client
from ...core.dependencies import get_current_user
from ...services.payment_service import payment_service
from ...models.user import User

router = APIRouter()


@router.post("/create-subscription")
async def create_subscription(
    user: User = Depends(get_current_user),
    redis_client = Depends(get_redis_client)
):
    """
    創建付費訂閱
    
    Args:
        user: 當前用戶
        
    Returns:
        訂閱資訊和客戶端密鑰
    """
    try:
        # 檢查用戶是否已經是付費用戶
        if user.is_premium:
            raise HTTPException(
                status_code=400,
                detail="用戶已經是付費會員"
            )
        
        # 創建或獲取 Stripe 客戶
        if not user.stripe_customer_id:
            customer_id = await payment_service.create_customer(user)
            
            # 更新用戶資料
            user_data = await redis_client.get(f"user:id:{user.user_id}")
            if user_data:
                user_dict = json.loads(user_data)
                user_dict["stripe_customer_id"] = customer_id
                user_dict["updated_at"] = datetime.now().isoformat()
                
                await redis_client.set(
                    f"user:id:{user.user_id}",
                    json.dumps(user_dict, default=str)
                )
        else:
            customer_id = user.stripe_customer_id
        
        # 創建訂閱
        subscription_info = await payment_service.create_subscription(customer_id)
        
        return {
            "success": True,
            "subscription_id": subscription_info["subscription_id"],
            "client_secret": subscription_info["client_secret"],
            "status": subscription_info["status"],
            "message": "訂閱創建成功，請完成付款"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"創建訂閱失敗: {str(e)}")


@router.post("/cancel-subscription")
async def cancel_subscription(
    user: User = Depends(get_current_user)
):
    """
    取消付費訂閱
    
    Args:
        user: 當前用戶
        
    Returns:
        取消結果
    """
    try:
        # 檢查用戶是否是付費用戶
        if not user.is_premium or not hasattr(user, 'stripe_subscription_id') or not user.stripe_subscription_id:
            raise HTTPException(
                status_code=400,
                detail="用戶沒有有效的付費訂閱"
            )
        
        # 取消訂閱
        cancel_info = await payment_service.cancel_subscription(user.stripe_subscription_id)
        
        return {
            "success": True,
            "subscription_id": cancel_info["subscription_id"],
            "status": cancel_info["status"],
            "canceled_at": cancel_info["canceled_at"],
            "message": "訂閱已取消"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"取消訂閱失敗: {str(e)}")


@router.get("/subscription-status")
async def get_subscription_status(
    user: User = Depends(get_current_user)
):
    """
    獲取用戶訂閱狀態
    
    Args:
        user: 當前用戶
        
    Returns:
        訂閱狀態資訊
    """
    try:
        response = {
            "user_id": user.user_id,
            "is_premium": user.is_premium,
            "has_subscription": False
        }
        
        if hasattr(user, 'stripe_subscription_id') and user.stripe_subscription_id:
            # 獲取訂閱詳情
            subscription_info = await payment_service.get_subscription(user.stripe_subscription_id)
            response.update({
                "has_subscription": True,
                "subscription_id": subscription_info["subscription_id"],
                "status": subscription_info["status"],
                "current_period_start": subscription_info["current_period_start"],
                "current_period_end": subscription_info["current_period_end"],
                "cancel_at_period_end": subscription_info["cancel_at_period_end"]
            })
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"獲取訂閱狀態失敗: {str(e)}")


@router.get("/usage-limits")
async def get_usage_limits(
    user: User = Depends(get_current_user),
    redis_client = Depends(get_redis_client)
):
    """
    獲取用戶使用限制和當前使用量
    
    Args:
        user: 當前用戶
        
    Returns:
        使用限制和使用量資訊
    """
    try:
        # 獲取今日使用量
        today = datetime.now().strftime("%Y-%m-%d")
        usage_key = f"daily_usage:{user.user_id}:{today}"
        current_usage = await redis_client.get(usage_key) or 0
        current_usage = int(current_usage)
        
        # 根據用戶類型設定限制
        if user.is_premium:
            daily_limit = settings.PREMIUM_DAILY_LIMIT
            file_size_limit = settings.PREMIUM_FILE_SIZE_LIMIT
            tier = "premium"
        else:
            daily_limit = settings.FREE_DAILY_LIMIT
            file_size_limit = settings.FREE_FILE_SIZE_LIMIT
            tier = "free"
        
        return {
            "user_tier": tier,
            "daily_usage": {
                "current": current_usage,
                "limit": daily_limit,
                "remaining": max(0, daily_limit - current_usage),
                "reset_date": today
            },
            "file_limits": {
                "max_size_mb": file_size_limit,
                "supported_formats": ["CSV"]
            },
            "features": {
                "big5_encoding": True,  # 免費版和付費版都支援
                "batch_processing": user.is_premium,
                "priority_processing": user.is_premium
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"獲取使用限制失敗: {str(e)}")


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None)
):
    """
    Stripe Webhook 端點
    
    Args:
        request: FastAPI Request 物件
        stripe_signature: Stripe 簽名標頭
        
    Returns:
        Webhook 處理結果
    """
    try:
        # 讀取請求載荷
        payload = await request.body()
        
        if not stripe_signature:
            raise HTTPException(
                status_code=400,
                detail="Missing Stripe signature header"
            )
        
        # 處理 Webhook
        result = await payment_service.handle_webhook(payload, stripe_signature)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook 處理失敗: {str(e)}")


@router.get("/pricing")
async def get_pricing():
    """
    獲取價格方案
    
    Returns:
        價格方案資訊
    """
    return {
        "plans": [
            {
                "name": "免費版",
                "price": 0,
                "currency": "USD",
                "interval": "month",
                "features": [
                    f"每日 {settings.FREE_DAILY_LIMIT} 個檔案",
                    f"檔案大小限制 {settings.FREE_FILE_SIZE_LIMIT}MB",
                    "支援 CSV（含Big5編碼）",
                    "基本功能使用"
                ],
                "limitations": [
                    "有檔案大小限制",
                    "有每日處理數量限制"
                ]
            },
            {
                "name": "付費版",
                "price": 9.99,
                "currency": "USD",
                "interval": "month",
                "features": [
                    f"每日 {settings.PREMIUM_DAILY_LIMIT} 個檔案",
                    f"檔案大小限制 {settings.PREMIUM_FILE_SIZE_LIMIT}MB",
                    "支援 CSV、Excel、TXT",
                    "優先處理",
                    "完整功能使用"
                ],
                "limitations": []
            }
        ],
        "payment_methods": ["信用卡", "Visa", "Mastercard", "American Express"]
    }