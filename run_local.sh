#!/bin/bash

# 本地開發環境啟動腳本（不使用 Docker）

set -e

echo "🚀 啟動檔案切分工具（本地開發模式）..."

# 檢查是否安裝了必要的工具
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安裝"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安裝"
    exit 1
fi

# 檢查並安裝 Redis
if ! command -v redis-server &> /dev/null; then
    echo "📦 正在安裝 Redis..."
    if command -v brew &> /dev/null; then
        brew install redis
    else
        echo "❌ 請先安裝 Homebrew 或手動安裝 Redis"
        exit 1
    fi
fi

# 啟動 Redis
echo "🔴 啟動 Redis..."
brew services start redis

# 設置後端
echo "🐍 設置 Python 後端..."
cd backend

# 創建虛擬環境（如果不存在）
if [ ! -d "venv" ]; then
    echo "📦 創建 Python 虛擬環境..."
    python3 -m venv venv
fi

# 啟動虛擬環境
source venv/bin/activate

# 安裝依賴（簡化版）
echo "📦 安裝 Python 依賴..."
pip install --upgrade pip
pip install fastapi uvicorn redis python-jose[cryptography] passlib[bcrypt] python-multipart structlog

# 啟動後端（在背景執行）
echo "🚀 啟動後端 API..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 等待後端啟動
sleep 5

# 檢查後端是否啟動成功
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ 後端 API 啟動成功"
else
    echo "❌ 後端 API 啟動失敗"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# 設置前端
echo "⚛️  設置 React 前端..."
cd ../frontend

# 安裝依賴
if [ ! -d "node_modules" ]; then
    echo "📦 安裝前端依賴..."
    npm install
fi

# 修改 API 基礎 URL（開發模式）
if [ ! -f "src/services/api.ts.backup" ]; then
    cp src/services/api.ts src/services/api.ts.backup
    sed -i '' "s|baseURL: 'http://localhost:8000/api/v1'|baseURL: 'http://localhost:8000/api/v1'|g" src/services/api.ts
fi

# 啟動前端開發伺服器
echo "🚀 啟動前端開發伺服器..."
npm run dev &
FRONTEND_PID=$!

# 等待前端啟動
sleep 10

echo ""
echo "🎉 檔案切分工具啟動完成！"
echo ""
echo "📍 訪問地址："
echo "   前端界面: http://localhost:5173"
echo "   後端 API: http://localhost:8000"
echo "   API 文檔: http://localhost:8000/docs"
echo ""
echo "🛠️  管理命令："
echo "   停止服務: 按 Ctrl+C"
echo "   查看日誌: 檢查終端輸出"
echo ""
echo "💡 使用說明："
echo "1. 打開瀏覽器訪問 http://localhost:5173"
echo "2. 註冊新帳戶或使用現有帳戶登入"
echo "3. 上傳 CSV、Excel 或 TXT 檔案"
echo "4. 選擇要切分的欄位"
echo "5. 下載處理結果"

# 等待用戶中斷
wait $FRONTEND_PID $BACKEND_PID

# 清理
echo ""
echo "🧹 清理服務..."
kill $BACKEND_PID 2>/dev/null || true
kill $FRONTEND_PID 2>/dev/null || true
brew services stop redis

echo "👋 檔案切分工具已停止"