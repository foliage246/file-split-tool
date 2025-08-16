#!/bin/bash

# 檔案切分工具部署腳本

set -e

echo "🚀 開始部署檔案切分工具..."

# 檢查 Docker 是否安裝
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安裝，請先安裝 Docker"
    exit 1
fi

# 檢查 Docker Compose 是否安裝
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安裝，請先安裝 Docker Compose"
    exit 1
fi

# 檢查環境文件
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件，從 .env.example 創建..."
    cp .env.example .env
    echo "📝 請編輯 .env 文件並設置正確的環境變數，特別是 Stripe 相關配置"
    echo "💡 編輯完成後請重新運行此腳本"
    exit 1
fi

# 讀取環境變數
source .env

# 檢查必要的環境變數
if [ -z "$STRIPE_SECRET_KEY" ] || [ "$STRIPE_SECRET_KEY" = "sk_test_your_stripe_secret_key_here" ]; then
    echo "⚠️  請在 .env 文件中設置正確的 STRIPE_SECRET_KEY"
    exit 1
fi

if [ -z "$JWT_SECRET_KEY" ] || [ "$JWT_SECRET_KEY" = "your-super-secret-jwt-key-change-this-in-production" ]; then
    echo "⚠️  請在 .env 文件中設置安全的 JWT_SECRET_KEY"
    exit 1
fi

echo "🏗️  構建 Docker 映像..."

# 停止現有容器
echo "🛑 停止現有容器..."
docker-compose down

# 構建映像
echo "📦 構建後端映像..."
docker-compose build backend

echo "📦 構建前端映像..."
docker-compose build frontend

# 啟動服務
echo "🎯 啟動所有服務..."
docker-compose up -d

# 等待服務啟動
echo "⏳ 等待服務啟動..."
sleep 10

# 檢查服務狀態
echo "🔍 檢查服務狀態..."
docker-compose ps

# 檢查健康狀態
echo "💚 檢查應用健康狀態..."

# 檢查 Redis
if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis 服務正常"
else
    echo "❌ Redis 服務異常"
fi

# 檢查後端 API
sleep 5
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ 後端 API 服務正常"
else
    echo "❌ 後端 API 服務異常"
    echo "📋 後端日誌："
    docker-compose logs backend --tail=20
fi

# 檢查前端
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ 前端服務正常"
else
    echo "❌ 前端服務異常"
    echo "📋 前端日誌："
    docker-compose logs frontend --tail=20
fi

echo ""
echo "🎉 部署完成！"
echo ""
echo "📍 應用訪問地址："
echo "   前端界面: http://localhost"
echo "   後端 API: http://localhost:8000"
echo "   API 文檔: http://localhost:8000/docs"
echo ""
echo "🛠️  管理命令："
echo "   查看日誌: docker-compose logs -f"
echo "   停止服務: docker-compose down"
echo "   重啟服務: docker-compose restart"
echo "   查看狀態: docker-compose ps"
echo ""
echo "💡 首次部署說明："
echo "1. 訪問 http://localhost 進入應用"
echo "2. 註冊新帳戶開始使用"
echo "3. 免費版每日可處理 5 個檔案"
echo "4. 升級付費版可獲得更多處理次數和檔案大小限制"