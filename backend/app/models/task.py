from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class TaskStatus(str, Enum):
    """任務狀態枚舉"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"

class FileData(BaseModel):
    """檔案數據模型"""
    file_id: str
    filename: str
    file_size: int
    columns: List[str]
    total_rows: int

class SplitRequest(BaseModel):
    """切分請求模型"""
    file_id: str
    split_column: str

class SplitResponse(BaseModel):
    """切分響應模型"""
    task_id: str
    estimated_files: int

class TaskStatusResponse(BaseModel):
    """任務狀態響應模型"""
    task_id: str
    status: TaskStatus
    progress: int
    message: Optional[str] = None
    result_files: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime

class ProcessResult(BaseModel):
    """處理結果模型"""
    output_files: List[str]
    zip_path: str
    file_count: int
    total_size: int

class ProcessingTask(BaseModel):
    """處理任務模型"""
    task_id: str
    user_id: str
    filename: str
    file_size_mb: float
    column_name: str
    status: TaskStatus = TaskStatus.PENDING
    progress: int = 0
    message: Optional[str] = None
    result_files: Optional[List[str]] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()