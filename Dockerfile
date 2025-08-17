# 簡化的單階段構建
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 安裝必要的系統工具
RUN apk add --no-cache curl

# 複製前端代碼
COPY frontend/ ./

# 清除緩存並安裝依賴
RUN npm cache clean --force
RUN npm ci --no-cache

# 構建前端
RUN npm run build

# 暴露端口
EXPOSE $PORT

# 使用 Vite 預覽服務器
CMD ["npm", "run", "start"]