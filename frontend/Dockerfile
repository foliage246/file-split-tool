# 多階段構建

# 階段 1: 構建階段
FROM node:20-alpine AS builder

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json (如果存在)
COPY package*.json ./

# 安裝依賴（包括 devDependencies）
RUN npm ci

# 複製源代碼
COPY . .

# 構建應用
RUN npm run build

# 階段 2: 生產階段
FROM nginx:alpine

# 複製構建結果到 nginx 目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]