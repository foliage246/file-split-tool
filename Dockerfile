# 完全清除緩存的構建
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 安裝必要的系統工具
RUN apk add --no-cache curl

# 複製前端代碼
COPY frontend/ ./

# 完全清除所有緩存
RUN rm -rf node_modules package-lock.json dist .vite
RUN npm cache clean --force
RUN npm cache verify

# 安裝依賴（不使用緩存）
RUN npm ci --no-cache --prefer-offline=false

# 構建前端（添加時間戳避免緩存）
ENV BUILD_VERSION=v3.0.0
RUN npm run build

# 暴露端口
EXPOSE $PORT

# 使用 Vite 預覽服務器
CMD ["npm", "run", "start"]