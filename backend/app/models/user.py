from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    """用戶基本模型"""
    user_id: str
    email: EmailStr
    hashed_password: Optional[str] = None
    is_premium: bool = False
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    subscription_status: Optional[str] = None
    subscription_start: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

class UserCreate(BaseModel):
    """創建用戶請求模型"""
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    """用戶登入請求模型"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """用戶響應模型"""
    user_id: str
    email: str
    is_premium: bool
    access_token: str
    token_type: str = "bearer"