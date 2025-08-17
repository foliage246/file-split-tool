import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  AppBar,
  Toolbar,
  Tab,
  Tabs
} from '@mui/material';

// 創建 Material-UI 主題
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", "Noto Sans TC", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// 導航組件
function Navigation() {
  const location = useLocation();
  const currentTab = location.pathname;

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          檔案分割工具
        </Typography>
        <Tabs 
          value={currentTab} 
          textColor="inherit" 
          sx={{ '& .MuiTab-root': { color: 'white', minWidth: 80 } }}
        >
          <Tab label="首頁" value="/" component={Link} to="/" />
          <Tab label="工具" value="/app" component={Link} to="/app" />
          <Tab label="價格" value="/pricing" component={Link} to="/pricing" />
        </Tabs>
        <Box sx={{ ml: 2 }}>
          <Button color="inherit" component={Link} to="/login" sx={{ mr: 1 }}>
            登入
          </Button>
          <Button variant="outlined" color="inherit" component={Link} to="/register">
            註冊
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// 首頁組件
function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 標題區域 */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h1" component="h1" gutterBottom>
          檔案分割工具
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          快速、安全、易用的檔案分割服務
        </Typography>
      </Box>

      {/* 功能特色卡片 */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3} mb={6}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🚀 免費版功能
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>每日 5 個檔案處理額度</li>
              <li>檔案大小限制 10MB</li>
              <li>支援 CSV 格式</li>
              <li>支援 Big5 編碼</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ⚡ 核心功能
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>按欄位值自動分割</li>
              <li>即時處理與下載</li>
              <li>ZIP 壓縮輸出</li>
              <li>資料安全保護</li>
            </ul>
          </CardContent>
        </Card>
      </Box>

      {/* 操作按鈕 */}
      <Box textAlign="center" gap={2} display="flex" justifyContent="center" flexWrap="wrap">
        <Button 
          variant="contained" 
          size="large"
          component={Link}
          to="/app"
          sx={{ minWidth: 150 }}
        >
          開始使用
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          component={Link}
          to="/pricing"
          sx={{ minWidth: 150 }}
        >
          了解更多
        </Button>
      </Box>
    </Container>
  );
}

// 工具頁面
function AppPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        檔案分割工具
      </Typography>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            📁 檔案上傳
          </Typography>
          <Typography color="text.secondary" paragraph>
            請選擇要分割的 CSV 檔案（開發中...）
          </Typography>
          <Button variant="contained" disabled>
            選擇檔案
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

// 價格頁面
function PricingPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        價格方案
      </Typography>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
        <Card>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              免費版
            </Typography>
            <Typography variant="h3" color="primary" gutterBottom>
              $0
            </Typography>
            <Typography color="text.secondary" paragraph>
              每月
            </Typography>
            <ul style={{ textAlign: 'left' }}>
              <li>每日 5 個檔案</li>
              <li>10MB 檔案限制</li>
              <li>CSV 格式支援</li>
              <li>基本功能</li>
            </ul>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              開始使用
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              專業版
            </Typography>
            <Typography variant="h3" color="primary" gutterBottom>
              $9.99
            </Typography>
            <Typography color="text.secondary" paragraph>
              每月
            </Typography>
            <ul style={{ textAlign: 'left' }}>
              <li>每日 50 個檔案</li>
              <li>100MB 檔案限制</li>
              <li>CSV + Excel + TXT</li>
              <li>優先處理</li>
            </ul>
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
              升級專業版
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

// 登入頁面
function LoginPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            登入
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            登入功能開發中...
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

// 註冊頁面
function RegisterPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            註冊
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            註冊功能開發中...
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;