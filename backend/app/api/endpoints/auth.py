from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
import json
import logging
from typing import Optional

from ...core.config import settings
from ...core.security import create_access_token, verify_token, get_password_hash, verify_password
from ...core.redis_client import get_redis_client
from ...core.dependencies import get_current_user
from ...models.user import User, UserCreate, UserLogin, UserResponse, ForgotPasswordRequest, ResetPasswordRequest, ForgotPasswordResponse, ResetPasswordResponse
from ...services.email_service import email_service, generate_reset_token

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)


@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    redis_client = Depends(get_redis_client)
):
    """
    用戶註冊
    
    Args:
        user_data: 用戶註冊資料
    
    Returns:
        註冊成功的用戶資訊和訪問令牌
    """
    try:
        # 檢查用戶是否已存在
        existing_user = await redis_client.get(f"user:email:{user_data.email}")
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="該電子郵件已被註冊"
            )
        
        # 創建新用戶
        user_id = f"user_{datetime.now().strftime('%Y%m%d%H%M%S')}_{hash(user_data.email) % 10000}"
        hashed_password = get_password_hash(user_data.password)
        
        user = User(
            user_id=user_id,
            email=user_data.email,
            hashed_password=hashed_password,
            is_premium=False,
            stripe_customer_id=None,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        # 儲存用戶資料
        await redis_client.set(
            f"user:id:{user_id}",
            json.dumps(user.dict(), default=str)
        )
        await redis_client.set(
            f"user:email:{user_data.email}",
            user_id
        )
        
        # 生成訪問令牌
        access_token = create_access_token(
            data={"sub": user_id, "email": user_data.email}
        )
        
        return UserResponse(
            user_id=user_id,
            email=user_data.email,
            is_premium=False,
            access_token=access_token,
            token_type="bearer"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"註冊失敗: {str(e)}")


@router.post("/login", response_model=UserResponse)
async def login(
    user_data: UserLogin,
    redis_client = Depends(get_redis_client)
):
    """
    用戶登入
    
    Args:
        user_data: 用戶登入資料
    
    Returns:
        登入成功的用戶資訊和訪問令牌
    """
    try:
        # 查找用戶
        user_id = await redis_client.get(f"user:email:{user_data.email}")
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="電子郵件或密碼錯誤"
            )
        
        # 獲取用戶資料
        user_data_str = await redis_client.get(f"user:id:{user_id}")
        if not user_data_str:
            raise HTTPException(
                status_code=401,
                detail="用戶資料不存在"
            )
        
        user_dict = json.loads(user_data_str)
        user = User(**user_dict)
        
        # 驗證密碼
        if not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="電子郵件或密碼錯誤"
            )
        
        # 生成訪問令牌
        access_token = create_access_token(
            data={"sub": user.user_id, "email": user.email}
        )
        
        # 更新最後登入時間
        user_dict["last_login"] = datetime.now().isoformat()
        await redis_client.set(
            f"user:id:{user.user_id}",
            json.dumps(user_dict, default=str)
        )
        
        return UserResponse(
            user_id=user.user_id,
            email=user.email,
            is_premium=user.is_premium,
            access_token=access_token,
            token_type="bearer"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"登入失敗: {str(e)}")


@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    獲取當前用戶資訊
    
    Returns:
        當前用戶詳細資訊
    """
    return current_user


@router.post("/logout")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    redis_client = Depends(get_redis_client)
):
    """
    用戶登出（將令牌加入黑名單）
    
    Args:
        credentials: HTTP Bearer 認證憑據
    
    Returns:
        登出成功訊息
    """
    try:
        token = credentials.credentials
        
        # 驗證令牌
        payload = verify_token(token)
        if payload is None:
            raise HTTPException(
                status_code=401,
                detail="無效的訪問令牌"
            )
        
        # 將令牌加入黑名單
        exp = payload.get("exp")
        if exp:
            ttl = exp - datetime.now().timestamp()
            if ttl > 0:
                await redis_client.setex(
                    f"blacklist_token:{token}",
                    int(ttl),
                    "blacklisted"
                )
        
        return {"message": "登出成功"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"登出失敗: {str(e)}")


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(
    request: ForgotPasswordRequest,
    redis_client = Depends(get_redis_client)
):
    """
    忘記密碼 - 發送重設連結到用戶郵箱
    
    Args:
        request: 包含用戶郵箱的請求
    
    Returns:
        成功訊息
    """
    try:
        # 檢查用戶是否存在
        user_id = await redis_client.get(f"user:email:{request.email}")
        if not user_id:
            # 為了安全起見，即使用戶不存在也返回成功訊息
            return ForgotPasswordResponse(
                message="If an account with that email exists, we've sent a password reset link."
            )
        
        # 生成重設token
        reset_token = generate_reset_token()
        
        # 將token存儲到Redis，設置1小時過期時間
        await redis_client.setex(
            f"password_reset:{reset_token}",
            3600,  # 1小時
            request.email
        )
        
        # 發送重設郵件
        email_sent = await email_service.send_password_reset_email(
            to_email=request.email,
            reset_token=reset_token
        )
        
        if not email_sent:
            # 記錄郵件發送失敗，但不向用戶透露具體錯誤
            logger.error(f"Failed to send password reset email to {request.email}")
        
        return ForgotPasswordResponse(
            message="If an account with that email exists, we've sent a password reset link."
        )
        
    except Exception as e:
        # 記錄錯誤但不向用戶透露具體訊息
        logger.error(f"Forgot password error for {request.email}: {str(e)}")
        return ForgotPasswordResponse(
            message="If an account with that email exists, we've sent a password reset link."
        )


@router.post("/reset-password", response_model=ResetPasswordResponse)
async def reset_password(
    request: ResetPasswordRequest,
    redis_client = Depends(get_redis_client)
):
    """
    重設密碼
    
    Args:
        request: 包含token和新密碼的請求
    
    Returns:
        重設結果訊息
    """
    try:
        # 驗證token
        email = await redis_client.get(f"password_reset:{request.token}")
        if not email:
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired reset token"
            )
        
        # 檢查密碼長度
        if len(request.new_password) < 6:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 6 characters long"
            )
        
        # 查找用戶
        user_id = await redis_client.get(f"user:email:{email}")
        if not user_id:
            raise HTTPException(
                status_code=400,
                detail="User not found"
            )
        
        # 獲取用戶資料
        user_data_str = await redis_client.get(f"user:id:{user_id}")
        if not user_data_str:
            raise HTTPException(
                status_code=400,
                detail="User data not found"
            )
        
        user_dict = json.loads(user_data_str)
        
        # 更新密碼
        new_hashed_password = get_password_hash(request.new_password)
        user_dict["hashed_password"] = new_hashed_password
        user_dict["updated_at"] = datetime.now().isoformat()
        
        # 儲存更新的用戶資料
        await redis_client.set(
            f"user:id:{user_id}",
            json.dumps(user_dict, default=str)
        )
        
        # 刪除已使用的重設token
        await redis_client.delete(f"password_reset:{request.token}")
        
        # 為安全起見，使所有該用戶的會話失效（可選）
        # 這裡可以添加邏輯來撤銷所有現有的token
        
        return ResetPasswordResponse(
            message="Password has been reset successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Password reset failed: {str(e)}")


@router.post("/test-email")
async def test_email(
    request: ForgotPasswordRequest,
    current_user: User = Depends(get_current_user)
):
    """
    測試郵件發送功能（僅供管理員或開發時使用）
    
    Args:
        request: 包含測試郵箱地址的請求
        current_user: 當前認證用戶
    
    Returns:
        郵件發送測試結果
    """
    try:
        # 生成測試token
        test_token = generate_reset_token()
        
        logger.info(f"Testing email service for {request.email}")
        
        # 嘗試發送測試郵件
        email_sent = await email_service.send_password_reset_email(
            to_email=request.email,
            reset_token=test_token
        )
        
        if email_sent:
            return {
                "success": True,
                "message": f"Test email successfully sent to {request.email}",
                "test_token": test_token
            }
        else:
            return {
                "success": False,
                "message": f"Failed to send test email to {request.email}",
                "note": "Check server logs for detailed error information"
            }
            
    except Exception as e:
        logger.error(f"Test email error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Email test failed: {str(e)}"
        )