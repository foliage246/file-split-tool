from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
import json
from typing import Optional

from ...core.config import settings
from ...core.security import create_access_token, verify_token, get_password_hash, verify_password
from ...core.redis_client import get_redis_client
from ...core.dependencies import get_current_user
from ...models.user import User, UserCreate, UserLogin, UserResponse

router = APIRouter()
security = HTTPBearer()


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