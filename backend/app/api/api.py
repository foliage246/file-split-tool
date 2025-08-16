from fastapi import APIRouter

from .endpoints import auth, files, payment

api_router = APIRouter()

# 認證相關路由
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

# 檔案處理相關路由
api_router.include_router(files.router, prefix="/files", tags=["file-processing"])

# 付費相關路由
api_router.include_router(payment.router, prefix="/payment", tags=["payment"])