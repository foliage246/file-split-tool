# 多階段構建 - 專為 Railway 優化
FROM node:18-alpine as builder

# 設置工作目錄
WORKDIR /app

# 複製前端 package 文件
COPY frontend/package*.json ./

# 安裝依賴
RUN npm ci

# 複製前端源代碼
COPY frontend/ ./

# 設置環境變數
ENV VITE_API_BASE_URL=https://gleaming-liberation-production-852d.up.railway.app/api/v1

# 構建應用
RUN npm run build

# 生產階段
FROM node:18-alpine

# 安裝 serve
RUN npm install -g serve

# 設置工作目錄
WORKDIR /app

# 從構建階段複製構建結果
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE $PORT

# 啟動命令
CMD ["sh", "-c", "serve -s dist -p $PORT"]