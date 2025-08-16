# Docker 安裝指南

由於檔案切分工具使用 Docker 進行部署，您需要先安裝 Docker 和 Docker Compose。

## macOS 安裝 Docker

### 方法 1: 使用 Docker Desktop（推薦）

1. **下載 Docker Desktop**
   - 訪問官方網站: https://www.docker.com/products/docker-desktop/
   - 點擊 "Download for Mac"
   - 根據您的 Mac 處理器選擇版本：
     - Apple Silicon (M1/M2): 下載 Apple Chip 版本
     - Intel: 下載 Intel Chip 版本

2. **安裝 Docker Desktop**
   ```bash
   # 下載完成後，雙擊 Docker.dmg 檔案
   # 將 Docker 拖拽到 Applications 資料夾
   # 從 Applications 啟動 Docker Desktop
   ```

3. **驗證安裝**
   ```bash
   # 等待 Docker Desktop 啟動完成後，在終端機執行
   docker --version
   docker-compose --version
   ```

### 方法 2: 使用 Homebrew

如果您已經安裝了 Homebrew，可以使用命令行安裝：

```bash
# 安裝 Docker Desktop
brew install --cask docker

# 啟動 Docker Desktop
open /Applications/Docker.app

# 等待啟動完成後驗證
docker --version
docker-compose --version
```

## 安裝後配置

### 1. 資源配置（建議）

打開 Docker Desktop → Settings → Resources：
- **Memory**: 至少分配 4GB RAM
- **Disk**: 至少預留 10GB 磁碟空間
- **CPU**: 至少分配 2 個 CPU 核心

### 2. 驗證 Docker 運行

```bash
# 測試 Docker 是否正常工作
docker run hello-world

# 如果看到 "Hello from Docker!" 訊息，表示安裝成功
```

## 部署檔案切分工具

Docker 安裝完成後，您可以繼續部署檔案切分工具：

```bash
# 1. 確保在專案目錄中
cd /Users/sy/Desktop/06_PythonCode/01_excel_csv_txt_split_per_batch

# 2. 檢查 .env 配置檔案
cat .env

# 3. 執行部署腳本
./deploy.sh
```

## 常見問題解決

### 問題 1: Docker Desktop 啟動失敗

**解決方案:**
```bash
# 重啟 Docker Desktop
killall Docker && open /Applications/Docker.app

# 或完全重新安裝
brew uninstall --cask docker
brew install --cask docker
```

### 問題 2: 權限問題

**解決方案:**
```bash
# 確保當前用戶在 docker 群組中
sudo dseditgroup -o edit -a $(whoami) -t user docker

# 重新啟動終端機或重新登入
```

### 問題 3: 磁碟空間不足

**解決方案:**
```bash
# 清理未使用的 Docker 資源
docker system prune -a

# 檢查磁碟空間
df -h
```

### 問題 4: 網路連接問題

**解決方案:**
```bash
# 檢查 Docker 網路
docker network ls

# 重置 Docker 網路（如果需要）
docker network prune
```

## 替代部署方案

如果您暫時無法安裝 Docker，也可以選擇手動部署：

### 手動部署後端

```bash
# 1. 安裝 Python 依賴
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. 安裝 Redis
brew install redis
brew services start redis

# 3. 啟動後端
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 手動部署前端

```bash
# 1. 安裝前端依賴
cd frontend
npm install

# 2. 修改 API 基礎 URL
# 編輯 src/services/api.ts，將 baseURL 改為 'http://localhost:8000/api/v1'

# 3. 啟動前端開發伺服器
npm run dev
```

## 驗證部署成功

部署完成後，檢查以下服務：

```bash
# 檢查服務狀態
curl http://localhost:8000/health  # 後端健康檢查
curl http://localhost/health       # 前端健康檢查

# 查看 Docker 容器狀態
docker ps
```

## 技術支援

如果遇到安裝或部署問題：

1. **查看日誌**
   ```bash
   docker logs <container_name>
   ```

2. **重啟服務**
   ```bash
   docker-compose restart
   ```

3. **完全重新部署**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

安裝完 Docker 後，您就可以享受一鍵部署的便利性了！🚀