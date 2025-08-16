from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json
from typing import Optional

from .redis_client import get_redis_client
from .security import verify_token
from ..models.user import User

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    redis_client = Depends(get_redis_client)
) -> User:
    """
    從 JWT 令牌獲取當前用戶
    
    Args:
        credentials: HTTP Bearer 認證憑據
    
    Returns:
        當前用戶物件
    """
    try:
        token = credentials.credentials
        
        # 檢查令牌是否在黑名單中
        blacklisted = await redis_client.get(f"blacklist_token:{token}")
        if blacklisted:
            raise HTTPException(
                status_code=401,
                detail="訪問令牌已失效"
            )
        
        # 驗證令牌
        payload = verify_token(token)
        if payload is None:
            raise HTTPException(
                status_code=401,
                detail="無效的訪問令牌"
            )
        
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="令牌中缺少用戶 ID"
            )
        
        # 獲取用戶資料
        user_data_str = await redis_client.get(f"user:id:{user_id}")
        if not user_data_str:
            raise HTTPException(
                status_code=401,
                detail="用戶不存在"
            )
        
        user_dict = json.loads(user_data_str)
        return User(**user_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="認證失敗"
        )