from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # 應用基本設定
    APP_NAME: str = "File Split Tool"
    API_VERSION: str = "v1"
    DEBUG: bool = False
    
    # 服務器設定
    HOST: str = "0.0.0.0"
    PORT: int = int(os.getenv("PORT", 8000))
    
    # 檔案處理設定
    FREE_FILE_SIZE_LIMIT: int = 10    # 10MB
    PREMIUM_FILE_SIZE_LIMIT: int = 100 # 100MB
    ALLOWED_EXTENSIONS: List[str] = [".csv", ".xlsx", ".xls", ".txt"]
    UPLOAD_DIR: str = "/app/storage/uploads"
    OUTPUT_DIR: str = "/app/storage/outputs"
    
    # 確保目錄存在
    def __post_init__(self):
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)
        os.makedirs(self.OUTPUT_DIR, exist_ok=True)
    
    # 用量限制
    FREE_DAILY_LIMIT: int = 5
    PREMIUM_DAILY_LIMIT: int = 50
    
    # Redis 設定 - Railway會提供REDIS_URL環境變數
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # 安全設定
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-super-secret-jwt-key-change-this-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    
    # Stripe 配置
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    STRIPE_PRICE_ID: str = os.getenv("STRIPE_PRICE_ID", "")
    
    # CORS 設定 - 添加Railway前端域名
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://localhost",
        "https://file-split-tool-production.up.railway.app",
        "*"  # 暫時允許所有來源，生產環境需要限制
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# 全局設定實例
settings = Settings()