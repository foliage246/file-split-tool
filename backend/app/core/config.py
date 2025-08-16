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
    PORT: int = 8000
    
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
    
    # Redis 設定
    REDIS_URL: str = "redis://localhost:6379"
    
    # 安全設定
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    
    # Stripe 配置
    STRIPE_SECRET_KEY: str = ""  # 從環境變數載入
    STRIPE_WEBHOOK_SECRET: str = ""  # 從環境變數載入
    STRIPE_PRICE_ID: str = ""  # $9.99/月產品價格 ID
    
    # CORS 設定
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# 全局設定實例
settings = Settings()