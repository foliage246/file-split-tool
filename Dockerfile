# 簡化構建流程
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 安裝必要的系統工具
RUN apk add --no-cache curl

# 複製前端代碼
COPY frontend/ ./

# 清除舊的構建檔案
RUN rm -rf node_modules dist .vite

# 安裝依賴
RUN npm install

# 構建前端
RUN npm run build

# 暴露端口
EXPOSE $PORT

# 使用 Vite 預覽服務器
CMD ["npm", "run", "start"]