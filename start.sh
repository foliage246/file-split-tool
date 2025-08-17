#!/bin/bash
set -e

# 設定默認端口
PORT=${PORT:-80}

# 更新 Nginx 配置中的端口
sed -i "s/listen 80 default_server;/listen $PORT default_server;/" /etc/nginx/nginx.conf

# 創建必要的目錄
mkdir -p /app/storage/uploads /app/storage/outputs

# 啟動 supervisor
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf