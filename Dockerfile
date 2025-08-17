# Railway 優化的單階段構建
FROM node:18-alpine

# 設置工作目錄
WORKDIR /app

# 複製前端 package 文件
COPY frontend/package*.json ./

# 安裝依賴和 serve
RUN npm ci && npm install serve

# 複製前端源代碼
COPY frontend/ ./

# 設置環境變數
ENV VITE_API_BASE_URL=https://gleaming-liberation-production-852d.up.railway.app/api/v1

# 構建應用
RUN npm run build

# 暴露端口
EXPOSE $PORT

# 啟動命令 - 使用本地安裝的 serve
CMD ["sh", "-c", "npx serve -s dist -p $PORT"]