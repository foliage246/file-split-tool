# 多階段構建 - 同時支援前端和後端
# BUILD_VERSION: 2024-08-17-v2

# 第一階段：構建前端
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# 清除 npm 緩存並安裝依賴
COPY frontend/package*.json ./
RUN npm cache clean --force
RUN npm ci --no-cache

# 複製源碼並構建
COPY frontend/ ./
RUN npm run build

# 第二階段：設定後端和前端服務
FROM python:3.11-slim

# 設定構建變數強制重建
ENV BUILD_TIMESTAMP=2024-08-17-15:30:00
ENV APP_VERSION=v2.0.0

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    curl \
    nginx \
    supervisor \
    libmagic1 \
    libmagic-dev \
    file \
    && rm -rf /var/lib/apt/lists/*

# 設定後端
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./

# 複製前端構建文件
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# 配置 Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# 配置 Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 創建必要的目錄
RUN mkdir -p /app/storage/uploads /app/storage/outputs

# 複製啟動腳本
COPY start.sh /start.sh
RUN chmod +x /start.sh

# 暴露端口
EXPOSE $PORT

# 啟動腳本
CMD ["/start.sh"]