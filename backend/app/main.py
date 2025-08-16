from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import structlog
import os
from datetime import datetime

from .core.config import settings
from .core.redis_client import redis_client

# 配置結構化日誌
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# 創建 FastAPI 應用實例
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    debug=settings.DEBUG
)

# CORS 中間件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 靜態文件服務（用於文件下載）
if os.path.exists(settings.OUTPUT_DIR):
    app.mount("/downloads", StaticFiles(directory=settings.OUTPUT_DIR), name="downloads")

@app.on_event("startup")
async def startup_event():
    """應用啟動事件"""
    logger.info("Starting File Split Tool API", version=settings.API_VERSION)
    
    # 連接 Redis
    await redis_client.connect()
    
    # 確保存儲目錄存在
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
    
    logger.info("Application started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """應用關閉事件"""
    logger.info("Shutting down File Split Tool API")
    
    # 斷開 Redis 連接
    await redis_client.disconnect()
    
    logger.info("Application shutdown complete")

@app.get("/")
async def root():
    """根路徑"""
    return {
        "message": "File Split Tool API",
        "version": settings.API_VERSION,
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """健康檢查端點"""
    try:
        # 檢查 Redis 連接
        await redis_client.redis.ping()
        redis_status = "healthy"
    except Exception as e:
        logger.error("Redis health check failed", error=str(e))
        redis_status = "unhealthy"
    
    return {
        "status": "healthy" if redis_status == "healthy" else "unhealthy",
        "services": {
            "redis": redis_status,
            "storage": "healthy" if os.path.exists(settings.UPLOAD_DIR) else "unhealthy"
        },
        "timestamp": datetime.now().isoformat()
    }

# API 路由
from .api.api import api_router
app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )