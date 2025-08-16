import redis.asyncio as redis
from typing import Optional
import json
import structlog
from .config import settings

logger = structlog.get_logger()

class RedisClient:
    """Redis 客戶端封裝"""
    
    def __init__(self):
        self.redis: Optional[redis.Redis] = None
    
    async def connect(self):
        """連接 Redis"""
        try:
            self.redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
            await self.redis.ping()
            logger.info("Redis connected successfully")
        except Exception as e:
            logger.error("Failed to connect to Redis", error=str(e))
            raise
    
    async def disconnect(self):
        """斷開 Redis 連接"""
        if self.redis:
            await self.redis.close()
            logger.info("Redis disconnected")
    
    async def set(self, key: str, value: str, ex: int = None):
        """設置鍵值"""
        return await self.redis.set(key, value, ex=ex)
    
    async def get(self, key: str) -> Optional[str]:
        """獲取值"""
        return await self.redis.get(key)
    
    async def delete(self, key: str):
        """刪除鍵"""
        return await self.redis.delete(key)
    
    async def hset(self, name: str, mapping: dict):
        """設置哈希表"""
        return await self.redis.hset(name, mapping=mapping)
    
    async def hget(self, name: str, key: str):
        """獲取哈希表值"""
        return await self.redis.hget(name, key)
    
    async def hgetall(self, name: str) -> dict:
        """獲取所有哈希表值"""
        return await self.redis.hgetall(name)
    
    async def expire(self, key: str, time: int):
        """設置過期時間"""
        return await self.redis.expire(key, time)
    
    async def incr(self, key: str) -> int:
        """原子性自增"""
        return await self.redis.incr(key)
    
    async def set_json(self, key: str, value: dict, ex: int = None):
        """設置 JSON 值"""
        json_str = json.dumps(value, default=str)
        return await self.set(key, json_str, ex=ex)
    
    async def get_json(self, key: str) -> Optional[dict]:
        """獲取 JSON 值"""
        value = await self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                logger.error("Failed to decode JSON", key=key, value=value)
                return None
        return None

# 全局 Redis 客戶端實例
redis_client = RedisClient()

def get_redis_client() -> RedisClient:
    """獲取 Redis 客戶端實例"""
    return redis_client