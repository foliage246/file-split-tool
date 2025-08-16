# 檔案切分工具 - 前端界面設計規劃

## 1. 極簡設計原則

### 1.1 核心設計理念
- **一目了然**: 3步驟操作流程清晰可見
- **無需學習**: 直觀的操作界面，第一次使用就能上手
- **功能明確**: 免費版和付費版功能差異清楚標示
- **即時反饋**: 每個操作都有立即的視覺回饋

### 1.2 視覺風格
- **主色調**: 藍色系 (#2196f3) 代表專業和信任
- **輔助色**: 
  - 成功綠色 (#4caf50)
  - 警告橙色 (#ff9800) 
  - 錯誤紅色 (#f44336)
- **字體**: 'Inter' 英文，'Noto Sans TC' 中文
- **圓角**: 統一 8px 圓角設計
- **留白**: 充足的空白空間降低認知負荷

## 2. 3步驟用戶界面流程

### 2.1 整體頁面結構
```
┌─────────────────────────────────────────────────────────┐
│  Logo  檔案切分工具                    [訂閱狀態] [?幫助]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ① 上傳檔案  →  ② 選擇欄位  →  ③ 下載結果                │
│                                                         │
│                                                         │
│                     主要操作區域                         │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│               [用量統計] [升級按鈕]                      │
└─────────────────────────────────────────────────────────┘
```

### 2.2 步驟指示器組件
```tsx
const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = [
    { id: 1, title: '上傳檔案', icon: 'upload' },
    { id: 2, title: '選擇欄位', icon: 'table' },
    { id: 3, title: '下載結果', icon: 'download' }
  ];

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div 
          key={step.id}
          className={`step ${currentStep >= step.id ? 'active' : 'inactive'}`}
        >
          <div className="step-number">{step.id}</div>
          <div className="step-title">{step.title}</div>
          {index < steps.length - 1 && <div className="step-arrow">→</div>}
        </div>
      ))}
    </div>
  );
};
```

## 3. 核心頁面設計

### 3.1 步驟1: 檔案上傳頁面

#### 界面佈局
```
┌─────────────────────────────────────────────────────────┐
│  ① 上傳檔案  →  ② 選擇欄位  →  ③ 下載結果                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         ┌─────────────────────────────────┐             │
│         │          📁 上傳區域             │             │
│         │                                 │             │
│         │    拖拽檔案到此處或點擊選擇       │             │
│         │                                 │             │
│         │   支援格式: CSV (免費版)          │             │
│         │   檔案大小: 最大 10MB            │             │
│         │                                 │             │
│         └─────────────────────────────────┘             │
│                                                         │
│         免費版限制: 每日 5 次處理                        │
│                                                         │
│         想要更多功能？                                  │
│         📊 Excel/TXT 支援                               │
│         📈 100MB 大檔案                                │
│         🚀 每日 50 次處理                               │
│         [立即升級 - $9.99/月]                          │
└─────────────────────────────────────────────────────────┘
```

#### DropZone 組件實現
```tsx
const FileDropZone: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const { user } = useAuth();
  const { uploadFile, isUploading } = useFileUpload();

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: user.is_premium 
      ? { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.xls', '.xlsx'], 'text/plain': ['.txt'] }
      : { 'text/csv': ['.csv'] },
    maxSize: user.is_premium ? 100 * 1024 * 1024 : 10 * 1024 * 1024, // 100MB : 10MB
    multiple: false
  });

  return (
    <div className="upload-container">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon size={64} color="#2196f3" />
        <h3>拖拽檔案到此處或點擊選擇</h3>
        
        <div className="format-info">
          {user.is_premium ? (
            <p>支援格式: CSV, Excel (.xlsx, .xls), TXT</p>
          ) : (
            <p>支援格式: CSV（免費版也支援 Big5 編碼）</p>
          )}
          <p>檔案大小: 最大 {user.is_premium ? '100MB' : '10MB'}</p>
        </div>

        {isUploading && (
          <div className="upload-progress">
            <LinearProgress />
            <p>正在上傳...</p>
          </div>
        )}
      </div>

      {!user.is_premium && <UpgradePrompt />}
    </div>
  );
};
```

### 3.2 步驟2: 欄位選擇頁面

#### 界面佈局
```
┌─────────────────────────────────────────────────────────┐
│  ① 上傳檔案  →  ② 選擇欄位  →  ③ 下載結果                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📄 example.csv (2.5MB, 1,250 行)           [重新上傳]  │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ 選擇切分欄位                                        ││
│  │                                                     ││
│  │ 切分依據: [下拉選單: 部門 ▼]                        ││
│  │                                                     ││
│  │ ☑ 保留標題行                                      ││
│  │ ☑ 跳過空值                                        ││
│  │                                                     ││
│  │ 預估結果: 將產生 3 個檔案                           ││
│  │ • 業務部 (500 行)                                 ││
│  │ • 技術部 (450 行)                                 ││
│  │ • 行政部 (300 行)                                 ││
│  │                                                     ││
│  │         [返回]    [開始切分]                        ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

#### 欄位選擇組件
```tsx
const ColumnSelector: React.FC<{ fileData: FileData }> = ({ fileData }) => {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const { startSplit, isProcessing } = useFileProcessing();

  const handleColumnChange = (column: string) => {
    setSelectedColumn(column);
    // 獲取預估結果
    fetchSplitPreview(fileData.file_id, column)
      .then(setPreviewData)
      .catch(console.error);
  };

  const handleStartSplit = () => {
    if (selectedColumn) {
      startSplit(fileData.file_id, selectedColumn);
    }
  };

  return (
    <Card className="column-selector">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          選擇切分欄位
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>切分依據</InputLabel>
          <Select
            value={selectedColumn}
            onChange={(e) => handleColumnChange(e.target.value)}
          >
            {fileData.columns.map((column) => (
              <MenuItem key={column} value={column}>
                {column}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="保留標題行"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="跳過空值"
          />
        </FormGroup>

        {previewData && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              預估結果: 將產生 {previewData.estimated_files} 個檔案
            </Typography>
            {previewData.file_preview.map((item: any) => (
              <Typography key={item.name} variant="body2" color="textSecondary">
                • {item.name} ({item.rows} 行)
              </Typography>
            ))}
          </Box>
        )}

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => window.history.back()}>
            返回
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            disabled={!selectedColumn || isProcessing}
            onClick={handleStartSplit}
          >
            開始切分
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
```

### 3.3 步驟3: 處理進度與下載頁面

#### 處理中界面
```
┌─────────────────────────────────────────────────────────┐
│  ① 上傳檔案  →  ② 選擇欄位  →  ③ 下載結果                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│             ⏳ 正在處理您的檔案...                       │
│                                                         │
│  ████████████████████░░░░░░░░  75%                     │
│                                                         │
│  目前狀態: 正在切分檔案...                              │
│  預估剩餘時間: 15 秒                                    │
│                                                         │
│                                                         │
│                   [取消處理]                           │
└─────────────────────────────────────────────────────────┘
```

#### 完成界面
```
┌─────────────────────────────────────────────────────────┐
│  ① 上傳檔案  →  ② 選擇欄位  →  ③ 下載結果                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  🎉 處理完成！                          │
│                                                         │
│  ✅ 成功切分為 3 個檔案                                 │
│  📦 壓縮檔案大小: 2.3MB                                │
│  ⏱ 處理時間: 45 秒                                     │
│                                                         │
│  生成的檔案:                                            │
│  📄 部門_業務部.csv    (800KB)                         │
│  📄 部門_技術部.csv    (750KB)                         │
│  📄 部門_行政部.csv    (500KB)                         │
│                                                         │
│         [📥 下載 ZIP 檔案]  [🔄 處理新檔案]            │
│                                                         │
│  ⚠️ 檔案將在 1 小時後自動刪除                           │
└─────────────────────────────────────────────────────────┘
```

#### 進度和結果組件
```tsx
const ProcessingStatus: React.FC<{ taskId: string }> = ({ taskId }) => {
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/api/v1/status/${taskId}`);
        setStatus(response.data);
        
        if (response.data.status === 'completed') {
          const downloadResponse = await api.get(`/api/v1/download/${taskId}`, {
            responseType: 'blob'
          });
          const url = URL.createObjectURL(downloadResponse.data);
          setDownloadUrl(url);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [taskId]);

  if (!status) {
    return <CircularProgress />;
  }

  if (status.status === 'processing') {
    return (
      <Card className="processing-card">
        <CardContent>
          <Box textAlign="center">
            <Typography variant="h5" gutterBottom>
              ⏳ 正在處理您的檔案...
            </Typography>
            
            <Box my={3}>
              <LinearProgress 
                variant="determinate" 
                value={status.progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {status.progress}%
              </Typography>
            </Box>

            <Typography color="textSecondary">
              目前狀態: {status.message || '正在處理...'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (status.status === 'completed' && downloadUrl) {
    return (
      <Card className="result-card">
        <CardContent>
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
              🎉 處理完成！
            </Typography>
            
            <Box my={2}>
              <Typography variant="body1">
                ✅ 成功切分為 {status.result_files?.length || 0} 個檔案
              </Typography>
              <Typography variant="body2" color="textSecondary">
                📦 已壓縮打包完成
              </Typography>
            </Box>

            <List dense>
              {status.result_files?.map((filename, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <InsertDriveFileIcon />
                  </ListItemIcon>
                  <ListItemText primary={filename} />
                </ListItem>
              ))}
            </List>

            <Box mt={3} display="flex" gap={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<DownloadIcon />}
                href={downloadUrl}
                download="split_files.zip"
              >
                下載 ZIP 檔案
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                startIcon={<RefreshIcon />}
              >
                處理新檔案
              </Button>
            </Box>

            <Alert severity="warning" sx={{ mt: 2 }}>
              檔案將在 1 小時後自動刪除
            </Alert>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Alert severity="error">
      處理失敗，請重新嘗試
    </Alert>
  );
};
```

## 4. 付費相關界面設計

### 4.1 升級提示組件
```tsx
const UpgradePrompt: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { createCheckoutSession } = useSubscription();

  const handleUpgrade = async () => {
    try {
      const { checkout_url } = await createCheckoutSession();
      window.location.href = checkout_url;
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  return (
    <>
      <Card className="upgrade-prompt" sx={{ mt: 2, bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            想要更多功能？
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <CheckIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">Excel/TXT 格式支援</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <CheckIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">100MB 大檔案處理</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <CheckIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">每日 50 次處理</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <CheckIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">優先處理隊列</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box mt={2} textAlign="center">
            <Typography variant="h5" color="primary" gutterBottom>
              $9.99/月
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleUpgrade}
              fullWidth
            >
              立即升級
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
```

### 4.2 用量限制提示
```tsx
const UsageLimitNotice: React.FC = () => {
  const { user, usage } = useAuth();

  if (user.is_premium) return null;

  const remaining = 5 - usage.daily_count;
  const isNearLimit = remaining <= 2;

  return (
    <Alert 
      severity={isNearLimit ? "warning" : "info"} 
      sx={{ mb: 2 }}
      action={
        <Button color="inherit" size="small" href="/upgrade">
          升級
        </Button>
      }
    >
      免費版限制: 今日還可處理 {remaining} 次
      {isNearLimit && " - 考慮升級以獲得更多用量"}
    </Alert>
  );
};
```

### 4.3 訂閱狀態組件
```tsx
const SubscriptionStatus: React.FC = () => {
  const { user, subscription } = useSubscription();
  
  if (!user.is_premium) {
    return (
      <Chip
        label="免費版"
        color="default"
        size="small"
      />
    );
  }

  return (
    <Tooltip title="付費版用戶">
      <Chip
        label="付費版"
        color="primary"
        size="small"
        icon={<StarIcon />}
      />
    </Tooltip>
  );
};
```

## 5. 響應式設計

### 5.1 斷點設置
```css
/* 手機版 */
@media (max-width: 768px) {
  .main-container {
    padding: 16px;
  }
  
  .step-indicator {
    flex-direction: column;
  }
  
  .dropzone {
    min-height: 200px;
    padding: 20px;
  }
}

/* 平板版 */
@media (min-width: 769px) and (max-width: 1024px) {
  .main-container {
    padding: 24px;
    max-width: 800px;
    margin: 0 auto;
  }
}

/* 桌面版 */
@media (min-width: 1025px) {
  .main-container {
    padding: 32px;
    max-width: 1000px;
    margin: 0 auto;
  }
}
```

### 5.2 手機版優化
```tsx
const MobileLayout: React.FC = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!isMobile) return <>{children}</>;

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            檔案切分工具
          </Typography>
          <SubscriptionStatus />
        </Toolbar>
      </AppBar>
      
      <Box sx={{ mt: 2 }}>
        {children}
      </Box>
    </Box>
  );
};
```

## 6. 狀態管理設計

### 6.1 全局狀態結構
```tsx
interface AppState {
  // 用戶狀態
  user: {
    id: string;
    email: string;
    is_premium: boolean;
  } | null;
  
  // 檔案狀態
  file: {
    data: FileData | null;
    upload_progress: number;
    processing_status: TaskStatus | null;
  };
  
  // UI 狀態
  ui: {
    current_step: 1 | 2 | 3;
    loading: boolean;
    error: string | null;
    show_upgrade_modal: boolean;
  };
  
  // 用量狀態
  usage: {
    daily_count: number;
    last_reset: string;
  };
}
```

### 6.2 Context Provider
```tsx
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 自動加載用戶狀態
  useEffect(() => {
    loadUserProfile().then(user => {
      dispatch({ type: 'SET_USER', payload: user });
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
```

### 6.3 自定義 Hooks
```tsx
export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAuth must be used within AppProvider');
  
  return {
    user: context.state.user,
    login: (email: string) => {
      // 實現登入邏輯
    },
    logout: () => {
      context.dispatch({ type: 'LOGOUT' });
    }
  };
};

export const useFileProcessing = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useFileProcessing must be used within AppProvider');
  
  const uploadFile = async (file: File) => {
    context.dispatch({ type: 'SET_UPLOADING', payload: true });
    
    try {
      const result = await api.uploadFile(file);
      context.dispatch({ type: 'SET_FILE_DATA', payload: result });
      context.dispatch({ type: 'SET_STEP', payload: 2 });
    } catch (error) {
      context.dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      context.dispatch({ type: 'SET_UPLOADING', payload: false });
    }
  };

  return {
    uploadFile,
    file: context.state.file,
    currentStep: context.state.ui.current_step
  };
};
```

## 7. 錯誤處理設計

### 7.1 全局錯誤邊界
```tsx
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error:', error, errorInfo);
    // 可以添加錯誤報告邏輯
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Alert severity="error">
            <AlertTitle>出現錯誤</AlertTitle>
            系統遇到問題，請重新整理頁面或稍後再試
            <Box mt={2}>
              <Button 
                variant="contained" 
                onClick={() => window.location.reload()}
              >
                重新整理
              </Button>
            </Box>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}
```

### 7.2 特定錯誤處理
```tsx
const ErrorAlert: React.FC<{ 
  error: string; 
  onRetry?: () => void;
  onUpgrade?: () => void;
}> = ({ error, onRetry, onUpgrade }) => {
  const getErrorMessage = (error: string) => {
    const errorMessages: Record<string, { message: string; action?: 'retry' | 'upgrade' }> = {
      'FILE_TOO_LARGE': { 
        message: '檔案大小超過限制', 
        action: 'upgrade' 
      },
      'USAGE_LIMIT_EXCEEDED': { 
        message: '今日使用次數已達上限', 
        action: 'upgrade' 
      },
      'INVALID_FILE_FORMAT': { 
        message: '不支援的檔案格式', 
        action: 'upgrade' 
      },
      'PROCESSING_FAILED': { 
        message: '檔案處理失敗', 
        action: 'retry' 
      }
    };

    return errorMessages[error] || { message: '發生未知錯誤' };
  };

  const errorInfo = getErrorMessage(error);

  return (
    <Alert 
      severity="error" 
      action={
        <Box>
          {errorInfo.action === 'retry' && onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              重試
            </Button>
          )}
          {errorInfo.action === 'upgrade' && onUpgrade && (
            <Button color="inherit" size="small" onClick={onUpgrade}>
              升級
            </Button>
          )}
        </Box>
      }
    >
      {errorInfo.message}
    </Alert>
  );
};
```

## 8. 動畫和互動設計

### 8.1 頁面轉場動畫
```css
.page-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-enter {
  opacity: 0;
  transform: translateX(30px);
}

.step-enter-active {
  opacity: 1;
  transform: translateX(0);
}

.step-exit {
  opacity: 1;
  transform: translateX(0);
}

.step-exit-active {
  opacity: 0;
  transform: translateX(-30px);
}
```

### 8.2 拖拽上傳動畫
```css
.dropzone {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.dropzone:hover {
  border-color: #2196f3;
  background-color: rgba(33, 150, 243, 0.04);
}

.dropzone.drag-active {
  border-color: #2196f3;
  background-color: rgba(33, 150, 243, 0.1);
  transform: scale(1.02);
}
```

### 8.3 按鈕互動動畫
```css
.upgrade-button {
  background: linear-gradient(45deg, #2196f3, #21cbf3);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.upgrade-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
}

.upgrade-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.upgrade-button:hover::after {
  left: 100%;
}
```

## 9. 輔助功能設計

### 9.1 鍵盤導航
```tsx
const KeyboardNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab 鍵循環焦點
      if (event.key === 'Tab') {
        // 處理 Tab 導航邏輯
      }
      
      // Enter 鍵觸發主要操作
      if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement?.classList.contains('primary-action')) {
          (activeElement as HTMLElement).click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <>{children}</>;
};
```

### 9.2 ARIA 標籤和語義化
```tsx
const ProgressIndicator: React.FC<{ progress: number; status: string }> = ({ progress, status }) => {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label={`處理進度 ${progress}%，${status}`}
    >
      <LinearProgress value={progress} />
      <Typography variant="body2" aria-live="polite">
        {status}
      </Typography>
    </div>
  );
};
```

## 10. 性能優化

### 10.1 代碼分割
```tsx
// 懒加載非關鍵頁面
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/PaymentCancel'));
const Help = lazy(() => import('./pages/Help'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/cancel" element={<PaymentCancel />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
```

### 10.2 記憶化優化
```tsx
const FilePreview = memo<{ data: FileData }>(({ data }) => {
  const previewColumns = useMemo(() => 
    data.columns.slice(0, 5), // 只顯示前5個欄位
    [data.columns]
  );

  const previewRows = useMemo(() => 
    data.sample_data?.slice(0, 10), // 只顯示前10行
    [data.sample_data]
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          {previewColumns.map(column => (
            <TableCell key={column}>{column}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {previewRows?.map((row, index) => (
          <TableRow key={index}>
            {previewColumns.map(column => (
              <TableCell key={column}>{row[column]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
```

這個前端設計規劃提供了完整的極簡用戶界面，專注於3步驟操作流程，清晰的付費功能區分，以及優秀的用戶體驗。設計既考慮了功能性，也注重了美觀和可用性。