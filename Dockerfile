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

# 安裝簡單的 HTTP 服務器
RUN npm install -g serve

# 暴露端口
EXPOSE 3000

# 設定默認端口並啟動
ENV PORT=3000
CMD ["sh", "-c", "serve -s dist -p ${PORT:-3000} --host 0.0.0.0"]