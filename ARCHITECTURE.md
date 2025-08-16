# 檔案切分工具 - 技術架構設計

## 1. 簡化架構概覽

```
┌─────────────────┐    ┌─────────────────┐
│   前端 (React)   │────│  後端 (FastAPI)  │
│   - 3步驟界面     │    │   - 核心 API       │
│   - 付費界面      │    │   - Stripe 整合    │
│   - 用量顯示     │    │   - 單一欄位切分  │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Nginx + 靜態   │    │    Redis 快取     │
│   - 前端資源     │    │   - 用戶會話     │
│   - API 代理     │    │   - 用量追蹤     │
└─────────────────┘    └─────────────────┘
```

### 架構特點
- **極簡設計**: 去除不必要的複雜度
- **單一責任**: 每個組件只負責一件事
- **簡化部署**: Docker Compose 一鍵部署
- **易於維護**: 直觀的程式碼結構

## 2. 技術棧選擇

### 2.1 前端技術棧
```json
{
  "framework": "React 18",
  "language": "TypeScript",
  "ui_library": "Material-UI v5",
  "state_management": "React Context + useReducer",
  "file_upload": "react-dropzone",
  "http_client": "axios",
  "bundler": "Vite",
  "payment": "@stripe/stripe-js"
}
```

### 2.2 後端技術棧
```json
{
  "framework": "FastAPI",
  "language": "Python 3.11+",
  "runtime": "uvicorn",
  "file_processing": {
    "csv": "pandas",
    "excel": "openpyxl", 
    "txt": "built-in"
  },
  "compression": "zipfile",
  "cache": "redis",
  "payment": "stripe",
  "validation": "pydantic",
  "auth": "JWT tokens"
}
```

### 2.3 基礎設施
```json
{
  "web_server": "Nginx",
  "containerization": "Docker + Docker Compose",
  "database": "Redis",
  "deployment": "單一伺服器",
  "monitoring": "基本日誌",
  "ssl": "Let's Encrypt"
}
```

## 3. 簡化的組件架構

### 3.1 前端組件架構

```
src/
├── components/
│   ├── FileUpload/
│   │   ├── DropZone.tsx          # 檔案上傳區
│   │   └── FilePreview.tsx       # 檔案預覽
│   ├── Split/
│   │   ├── ColumnSelector.tsx    # 欄位選擇器
│   │   └── ProcessProgress.tsx   # 處理進度
│   ├── Payment/
│   │   ├── UpgradeModal.tsx      # 升級模態框
│   │   └── SubscriptionStatus.tsx # 訂閱狀態
│   └── Common/
│       ├── UsageLimits.tsx       # 使用限制提示
│       └── DownloadButton.tsx    # 下載按鈕
├── hooks/
│   ├── useFileProcessing.ts  # 檔案處理
│   ├── useAuth.ts            # 用戶認證
│   └── useSubscription.ts    # 訂閱管理
├── services/
│   ├── api.ts               # API 客戶端
│   ├── stripeService.ts     # Stripe 整合
│   └── fileService.ts       # 檔案處理服務
└── types/
    ├── user.ts             # 用戶類型
    ├── file.ts             # 檔案類型
    └── payment.ts          # 付費類型
```

### 3.2 後端簡化架構

```
app/
├── api/
│   ├── endpoints/
│   │   ├── files.py             # 檔案上傳/處理/下載
│   │   ├── payment.py           # Stripe 付費整合
│   │   └── users.py             # 用戶管理
│   └── middleware.py            # 權限檢查中間件
├── core/
│   ├── config.py            # 配置管理
│   └── security.py          # 安全配置
├── services/
│   ├── file_processor.py    # 檔案處理引擎
│   ├── stripe_service.py    # Stripe 服務
│   └── usage_limiter.py     # 用量限制器
├── models/
│   ├── user.py              # 用戶模型
│   └── task.py              # 任務模型
└── utils/
    ├── file_utils.py        # 檔案工具
    └── validation.py        # 驗證工具
```

## 4. 核心數據流設計

### 4.1 簡化的 3 步驟流程
```
步驟 1: 上傳檔案
用戶上傳 → 檔案驗證 → 權限檢查 → 暫存儲存 → 返回檔案資訊

步驟 2: 選擇欄位
顯示欄位 → 用戶選擇 → 預覽切分結果 → 確認處理

步驟 3: 處理下載
開始處理 → 顯示進度 → 生成 ZIP 檔 → 下載連結 → 清理暫存
```

### 4.2 付費升級流程
```
觸發限制 → 顯示升級提示 → Stripe Checkout → 付費成功 → 權限解鎖
```

### 4.3 用量管理流程
```
API 請求 → 用戶認證 → 權限檢查 → 用量計數 → 繼續/拒絕
```

## 5. 簡化的 API 設計

### 5.1 核心檔案 API（4個端點）

```python
# 1. 檔案上傳
POST /api/v1/upload
Headers: Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
Response: {
  "file_id": "uuid",
  "filename": "string",
  "columns": ["string"],
  "total_rows": "number"
}

# 2. 開始切分
POST /api/v1/split
Body: {
  "file_id": "uuid",
  "split_column": "string"
}
Response: {
  "task_id": "uuid",
  "estimated_files": "number"
}

# 3. 查詢進度
GET /api/v1/status/{task_id}
Response: {
  "status": "processing|completed|error",
  "progress": "number",
  "result_files": ["string"]
}

# 4. 下載結果
GET /api/v1/download/{task_id}
Response: Binary ZIP file
```

### 5.2 Stripe 付費 API

```python
# 創建付費會話
POST /api/v1/payment/create-checkout
Response: {
  "checkout_url": "string"
}

# 訂閱狀態查詢
GET /api/v1/payment/subscription-status
Response: {
  "is_premium": "boolean",
  "expires_at": "datetime"
}

# 取消訂閱
POST /api/v1/payment/cancel-subscription
Response: {
  "message": "Subscription canceled"
}

# Stripe Webhook
POST /api/v1/payment/stripe-webhook
Headers: Stripe-Signature
```

### 5.3 用戶認證 API

```python
# 用戶註冊/登入
POST /api/v1/auth/login
Body: {"email": "string"}
Response: {
  "access_token": "jwt",
  "user_id": "uuid"
}

# 獲取用戶資訊
GET /api/v1/auth/me
Response: {
  "user_id": "uuid",
  "email": "string",
  "is_premium": "boolean",
  "daily_usage": "number"
}
```

## 6. Redis 數據結構設計

### 6.1 用戶會話資料
```json
// Key: session:{jwt_token}
{
  "user_id": "uuid",
  "email": "string",
  "is_premium": "boolean",
  "stripe_customer_id": "string",
  "expires_at": "datetime"
}
```

### 6.2 用量追蹤資料
```json
// Key: usage:{user_id}:{date}
{
  "daily_count": "number",
  "last_request": "datetime"
}
```

### 6.3 檔案處理任務
```json
// Key: task:{task_id}
{
  "user_id": "uuid",
  "filename": "string",
  "split_column": "string",
  "status": "processing|completed|error",
  "progress": "number",
  "result_files": ["string"],
  "zip_path": "string",
  "created_at": "datetime",
  "expires_at": "datetime"  // 1小時後自動清理
}
```

### 6.4 檔案暫存記錄
```json
// Key: file:{file_id}
{
  "user_id": "uuid",
  "filename": "string",
  "file_path": "string",
  "file_size": "number",
  "columns": ["string"],
  "uploaded_at": "datetime",
  "expires_at": "datetime"  // 1小時後自動清理
}
```

## 7. 簡化的檔案處理引擎

### 7.1 核心處理器（單一欄位切分）
```python
class FileProcessor:
    def __init__(self):
        self.supported_formats = {
            '.csv': self.read_csv,
            '.xlsx': self.read_excel,
            '.xls': self.read_excel,
            '.txt': self.read_txt
        }
    
    def process_file(self, file_path: str, split_column: str) -> str:
        """核心處理邏輯：僅支持單一欄位切分"""
        # 讀取檔案
        data = self.read_file(file_path)
        
        # 按單一欄位切分
        split_data = self.split_by_column(data, split_column)
        
        # 保存切分檔案
        output_files = self.save_split_files(split_data, file_path)
        
        # 創建 ZIP 壓縮檔
        zip_path = self.create_zip(output_files)
        
        return zip_path
    
    def split_by_column(self, data: pd.DataFrame, column: str) -> Dict[str, pd.DataFrame]:
        """按單一欄位值切分數據"""
        if column not in data.columns:
            raise ValueError(f"欄位 '{column}' 不存在")
        
        # 獲取該欄位的所有唯一值
        unique_values = data[column].dropna().unique()
        
        result = {}
        for value in unique_values:
            # 過濾該值的記錄
            subset = data[data[column] == value]
            if len(subset) > 0:
                # 清理檔案名稱
                clean_value = self.clean_filename(str(value))
                result[f"{column}_{clean_value}"] = subset
        
        return result
    
    def clean_filename(self, value: str) -> str:
        """清理檔案名中的非法字元"""
        import re
        # 移除或取代非法檔案名字元
        clean = re.sub(r'[<>:"/\\|?*]', '_', value)
        return clean[:50]  # 限制長度
```

### 7.2 不同檔案格式支持（包含免費版 Big5 編碼支持）
```python
def read_csv(self, file_path: str) -> pd.DataFrame:
    """CSV 檔案讀取（免費版也支持 Big5 編碼）"""
    encodings = ['utf-8', 'big5', 'gb2312', 'latin-1']
    
    for encoding in encodings:
        try:
            return pd.read_csv(file_path, encoding=encoding)
        except (UnicodeDecodeError, UnicodeError):
            continue
    
    # 如果所有編碼都失敗，使用 errors='replace'
    return pd.read_csv(file_path, encoding='utf-8', errors='replace')

def read_excel(self, file_path: str) -> pd.DataFrame:
    """Excel 檔案讀取（付費版）"""
    return pd.read_excel(file_path)

def read_txt(self, file_path: str) -> pd.DataFrame:
    """TXT 檔案讀取（付費版）"""
    # 自動檢測分隔符
    with open(file_path, 'r', encoding='utf-8') as f:
        first_line = f.readline()
    
    if '\t' in first_line:
        return pd.read_csv(file_path, sep='\t')
    else:
        return pd.read_csv(file_path)
```

### 7.3 簡化的任務管理器
```python
class TaskManager:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.processor = FileProcessor()
    
    async def create_task(self, user_id: str, file_path: str, split_column: str) -> str:
        """創建處理任務"""
        task_id = str(uuid.uuid4())
        
        # 將任務信息存儲到 Redis
        task_data = {
            'user_id': user_id,
            'file_path': file_path,
            'split_column': split_column,
            'status': 'processing',
            'progress': 0,
            'created_at': datetime.utcnow().isoformat()
        }
        
        self.redis.hset(f'task:{task_id}', mapping=task_data)
        self.redis.expire(f'task:{task_id}', 3600)  # 1小時後過期
        
        # 立即開始處理（非並發）
        asyncio.create_task(self.process_task(task_id))
        
        return task_id
    
    async def process_task(self, task_id: str):
        """處理任務（非並發）"""
        try:
            # 獲取任務信息
            task_data = self.redis.hgetall(f'task:{task_id}')
            
            # 更新進度
            self.redis.hset(f'task:{task_id}', 'progress', 50)
            
            # 處理檔案
            zip_path = self.processor.process_file(
                task_data['file_path'], 
                task_data['split_column']
            )
            
            # 更新完成狀態
            self.redis.hset(f'task:{task_id}', mapping={
                'status': 'completed',
                'progress': 100,
                'zip_path': zip_path
            })
            
        except Exception as e:
            # 錯誤處理
            self.redis.hset(f'task:{task_id}', mapping={
                'status': 'error',
                'error_message': str(e)
            })
```

## 8. 安全和用量限制設計

### 8.1 檔案上傳安全
- **檔案類型限制**: 白名單驗證（.csv, .xlsx, .xls, .txt）
- **檔案大小限制**: 免費版 10MB，付費版 100MB
- **隨機檔案名**: UUID 命名防止路徑遍歷
- **自動清理**: 1小時後自動刪除所有檔案

### 8.2 用量限制安全
```python
class UsageLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    async def check_usage_limit(self, user_id: str, is_premium: bool) -> bool:
        """檢查用量限制"""
        today = datetime.now().date().isoformat()
        key = f'usage:{user_id}:{today}'
        
        current_usage = int(self.redis.get(key) or 0)
        limit = 50 if is_premium else 5
        
        if current_usage >= limit:
            raise UsageLimitExceeded(f"已達每日限制 {limit} 次")
        
        # 增加使用次數
        self.redis.incr(key)
        self.redis.expire(key, 86400)  # 24小時過期
        
        return True
```

### 8.3 Stripe 付費安全
- **支付資訊保護**: 由 Stripe 處理，PCI DSS 符合
- **Webhook 驗證**: 使用 Stripe 簽名驗證
- **訂閱狀態同步**: 即時更新用戶權限
- **退款機制**: 自動處理 7 天內退款

### 8.4 API 安全
```python
class SecurityMiddleware:
    @staticmethod
    async def verify_jwt_token(token: str) -> dict:
        """驗證 JWT 令牌"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(401, "令牌已過期")
        except jwt.InvalidTokenError:
            raise HTTPException(401, "無效令牌")
    
    @staticmethod
    async def rate_limiting(request: Request):
        """簡單的請求限制"""
        client_ip = request.client.host
        # 實現簡單的 IP 限制邏輯
        pass
```

## 9. 性能優化策略

### 9.1 檔案處理優化
```python
class PerformanceOptimizer:
    @staticmethod
    def process_large_file(file_path: str, chunk_size: int = 10000):
        """分塊處理大檔案以節省記憶體"""
        for chunk in pd.read_csv(file_path, chunksize=chunk_size):
            yield chunk
    
    @staticmethod
    def memory_monitor():
        """監控記憶體使用量"""
        import psutil
        memory_percent = psutil.virtual_memory().percent
        if memory_percent > 80:
            raise MemoryError("記憶體使用率過高")
```

### 9.2 Redis 快取配置
```python
CACHE_SETTINGS = {
    "user_session": {"ttl": 3600},      # 1小時
    "usage_tracking": {"ttl": 86400},   # 24小時  
    "file_metadata": {"ttl": 3600},     # 1小時
    "task_status": {"ttl": 3600},       # 1小時
    "stripe_customer": {"ttl": 7200}    # 2小時
}
```

### 9.3 前端性能優化
- **懶加載**: 使用 React.lazy() 加載非關鍵組件
- **記憶化**: useMemo() 緩存昂貴計算
- **防抖動**: 使用者輸入防抖動處理
- **小檔案**: Vite 打包優化，減少 bundle 大小

### 9.4 伺服器資源管理
```yaml
# Docker 資源限制
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0' 
          memory: 2G
```

## 10. 監控和日誌

### 10.1 關鍵指標監控
- **技術指標**: 檔案處理成功率、API 響應時間
- **業務指標**: 日活躍用戶、轉換率、流失率
- **系統指標**: CPU/記憶體使用率、磁盤空間
- **付費指標**: Stripe 交易成功率、退款率

### 10.2 簡化的日誌系統
```python
import structlog

logger = structlog.get_logger()

# 檔案處理日誌
logger.info(
    "file_processed",
    user_id=user_id,
    file_size=file_size,
    processing_time=time_taken,
    result_files_count=len(result_files)
)

# 付費事件日誌
logger.info(
    "payment_event",
    user_id=user_id,
    event_type="subscription_created",
    stripe_customer_id=customer_id
)

# 錯誤日誌
logger.error(
    "processing_failed",
    user_id=user_id,
    error_type=error.__class__.__name__,
    error_message=str(error)
)
```

### 10.3 健康檢查端點
```python
@app.get("/health")
async def health_check():
    """系統健康狀態檢查"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "redis": check_redis_connection(),
        "disk_usage": get_disk_usage(),
        "memory_usage": get_memory_usage()
    }
```

## 11. 簡化的部署架構

### 11.1 Docker Compose 配置
```yaml
version: '3.8'
services:
  # 前端應用
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://backend:8000
      - REACT_APP_STRIPE_PK=${STRIPE_PUBLISHABLE_KEY}
    depends_on:
      - backend

  # 後端 API
  backend:
    build:
      context: ./backend  
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://redis:6379
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      - redis
    volumes:
      - ./storage:/app/storage  # 暫存檔案目錄

  # Redis 快取資料庫
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  redis_data:
```

### 11.2 環境變數配置
```python
# backend/app/core/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    # 應用基本設定
    APP_NAME: str = "File Split Tool"
    API_VERSION: str = "v1"
    DEBUG: bool = False
    
    # 檔案處理設定
    MAX_FILE_SIZE_FREE: int = 10 * 1024 * 1024    # 10MB
    MAX_FILE_SIZE_PREMIUM: int = 100 * 1024 * 1024 # 100MB
    ALLOWED_EXTENSIONS: list = [".csv", ".xlsx", ".xls", ".txt"]
    UPLOAD_DIR: str = "/app/storage/uploads"
    OUTPUT_DIR: str = "/app/storage/outputs"
    
    # 用量限制
    DAILY_LIMIT_FREE: int = 5
    DAILY_LIMIT_PREMIUM: int = 50
    
    # Redis 設定
    REDIS_URL: str = "redis://localhost:6379"
    
    # 安全設定
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    
    # Stripe 配置
    STRIPE_SECRET_KEY: str
    STRIPE_WEBHOOK_SECRET: str
    STRIPE_PRICE_ID: str  # $9.99/月產品價格 ID
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### 11.3 CSV 編碼支持（免費版也支持 Big5）
```python
def read_csv_with_encoding(file_path: str) -> pd.DataFrame:
    """免費版也支持 Big5 編碼的 CSV 讀取"""
    encodings = ['utf-8', 'big5', 'gb2312', 'latin-1']
    
    for encoding in encodings:
        try:
            return pd.read_csv(file_path, encoding=encoding)
        except (UnicodeDecodeError, UnicodeError):
            continue
    
    # 如果所有編碼都失敗，使用 errors='replace'
    return pd.read_csv(file_path, encoding='utf-8', errors='replace')
```

### 11.4 一鍵部署指令
```bash
#!/bin/bash
# deploy.sh

echo "開始部署檔案切分工具..."

# 建立必要目錄
mkdir -p storage/uploads storage/outputs

# 建置並啟動服務
docker-compose build
docker-compose up -d

# 等待服務就緒
echo "等待服務啟動..."
sleep 30

# 檢查服務狀態
docker-compose ps

echo "部署完成！訪問 http://localhost 使用應用"
```

這個簡化的技術架構提供了完整但簡潔的系統設計，專注於核心功能和 Stripe 付費整合，同時保持了高可維護性和易於部署的特點。免費版也完整支持 Big5 編碼的 CSV 檔案。