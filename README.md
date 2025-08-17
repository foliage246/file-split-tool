# 檔案分割工具 (File Split Tool)

🚀 **基於欄位值的智能檔案分割工具**

專業的桌面版檔案處理系統，支援 CSV、Excel、TXT 檔案按欄位值自動分割。採用 Freemium 商業模式，提供免費與付費雙重體驗。

**線上體驗**：
- 🌐 **前端應用**：https://file-split-tool-production.up.railway.app  
- 📖 **API 文檔**：https://gleaming-liberation-production-852d.up.railway.app/docs

## 🚀 功能特色

- **多格式支援**: CSV（含 Big5 編碼）、Excel (.xlsx, .xls)、TXT 檔案
- **智能編碼檢測**: 自動檢測並支援 UTF-8、Big5、GB2312 等多種編碼
- **單欄位切分**: 按指定欄位值自動分組並生成獨立檔案
- **批次處理**: 支援設定每個檔案的最大行數限制
- **免費增值模式**: 免費版和付費版不同的使用限制
- **安全處理**: 檔案處理完成 1 小時後自動刪除

## 📋 系統需求

- Docker >= 20.10
- Docker Compose >= 2.0
- 至少 2GB 可用內存
- 至少 5GB 可用磁盤空間

## 🛠️ 快速開始

### 1. 克隆專案

```bash
git clone <repository-url>
cd 01_excel_csv_txt_split_per_batch
```

### 2. 配置環境

```bash
# 複製環境配置文件
cp .env.example .env

# 編輯環境配置（必須設置 Stripe 密鑰）
vim .env
```

### 3. 一鍵部署

```bash
./deploy.sh
```

### 4. 訪問應用

- 前端界面: http://localhost
- API 文檔: http://localhost:8000/docs
- 健康檢查: http://localhost:8000/health

## 🏗️ 項目結構

```
01_excel_csv_txt_split_per_batch/
├── backend/                 # FastAPI 後端
│   ├── app/
│   │   ├── api/            # API 路由
│   │   ├── core/           # 核心配置
│   │   ├── models/         # 數據模型
│   │   ├── services/       # 業務邏輯
│   │   └── utils/          # 工具函數
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # React 前端
│   ├── src/
│   │   ├── components/     # React 組件
│   │   ├── pages/          # 頁面組件
│   │   ├── services/       # API 服務
│   │   └── types/          # TypeScript 類型
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml      # Docker 編排
├── deploy.sh              # 一鍵部署腳本
└── README.md
```

## 💰 價格方案

| 功能 | 免費版 | 付費版 ($9.99/月) |
|------|--------|------------------|
| 檔案格式 | 僅 CSV | CSV + Excel + TXT |
| 每日處理量 | 5 個檔案 | 50 個檔案 |
| 檔案大小限制 | 10MB | 100MB |
| 處理速度 | 標準 | 優先處理 |
| 技術支援 | 社群 | 專業客服 |

## 🏗️ 技術架構

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     前端        │    │     後端        │    │     Redis       │
│ React 19        │◄──►│ FastAPI         │◄──►│ 會話存儲        │
│ TypeScript      │    │ Python 3.11+    │    │ 任務狀態        │
│ Material-UI v7  │    │ pandas/openpyxl │    │ 使用量追蹤      │
│ Railway 部署    │    │ Stripe SDK      │    │ 檔案結果        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 核心技術
- **前端**：React 19 + TypeScript + Material-UI v7 + Vite
- **後端**：FastAPI + Python 3.11+ + pandas + openpyxl  
- **資料庫**：Redis 7 (會話、任務、緩存)
- **付費**：Stripe 訂閱系統
- **部署**：Railway + Docker + Nginx

## 🔧 環境變數配置

### 必需配置

```bash
# Stripe 付費系統
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_monthly_price_id

# JWT 安全密鑰
JWT_SECRET_KEY=your-super-secret-jwt-key
```

### 可選配置

```bash
# 檔案處理限制
FREE_FILE_SIZE_LIMIT=10        # 免費版檔案大小限制(MB)
PREMIUM_FILE_SIZE_LIMIT=100    # 付費版檔案大小限制(MB)
FREE_DAILY_LIMIT=5             # 免費版每日處理次數
PREMIUM_DAILY_LIMIT=50         # 付費版每日處理次數

# Redis 配置
REDIS_URL=redis://redis:6379

# CORS 設置
CORS_ORIGINS=["http://localhost:3000","http://localhost"]
```

## 📚 API 文檔

### 認證相關
- `POST /api/v1/auth/register` - 用戶註冊
- `POST /api/v1/auth/login` - 用戶登入
- `POST /api/v1/auth/logout` - 用戶登出
- `GET /api/v1/auth/me` - 獲取當前用戶

### 檔案處理
- `POST /api/v1/files/upload` - 上傳檔案並開始處理
- `GET /api/v1/files/status/{task_id}` - 查詢處理狀態
- `GET /api/v1/files/download/{task_id}` - 下載處理結果

### 付費系統
- `POST /api/v1/payment/create-subscription` - 創建訂閱
- `POST /api/v1/payment/cancel-subscription` - 取消訂閱
- `GET /api/v1/payment/subscription-status` - 查詢訂閱狀態
- `GET /api/v1/payment/usage-limits` - 查詢使用限制

## 🐳 Docker 管理

### 查看服務狀態
```bash
docker-compose ps
```

### 查看日誌
```bash
# 查看所有服務日誌
docker-compose logs -f

# 查看特定服務日誌
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f redis
```

### 重啟服務
```bash
# 重啟所有服務
docker-compose restart

# 重啟特定服務
docker-compose restart backend
```

### 停止服務
```bash
docker-compose down
```

### 重新構建並啟動
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

## 🔒 安全注意事項

1. **環境變數**: 生產環境必須設置強密碼和真實的 Stripe 密鑰
2. **HTTPS**: 生產環境建議配置 SSL 證書
3. **防火牆**: 只開放必要的端口 (80, 443)
4. **備份**: 定期備份 Redis 數據和配置文件
5. **監控**: 建議設置應用監控和日誌收集

## 🚨 故障排除

### 常見問題

1. **服務無法啟動**
   ```bash
   # 查看詳細錯誤日誌
   docker-compose logs backend
   docker-compose logs frontend
   ```

2. **Redis 連接失敗**
   ```bash
   # 檢查 Redis 狀態
   docker-compose exec redis redis-cli ping
   ```

3. **檔案上傳失敗**
   - 檢查檔案大小是否超過限制
   - 檢查檔案格式是否支援
   - 查看後端日誌確認錯誤原因

4. **Stripe 付費功能異常**
   - 確認 Stripe 密鑰配置正確
   - 檢查 webhook 端點設置
   - 查看 Stripe Dashboard 中的事件日誌

### 性能優化

1. **增加內存**: 修改 Docker Compose 配置增加內存限制
2. **Redis 優化**: 配置 Redis 持久化和內存策略
3. **nginx 優化**: 調整 worker 進程數和連接數
4. **檔案清理**: 定期清理過期的處理結果檔案

## 📞 技術支援

- 問題報告: 請在 GitHub Issues 中提交
- 功能建議: 歡迎提交 Pull Request
- 技術討論: 請使用 GitHub Discussions

## 📄 開源協議

本專案採用 MIT 協議開源，詳見 [LICENSE](LICENSE) 文件。