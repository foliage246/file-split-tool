import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box, Alert } from '@mui/material';
import { SimpleAuthProvider } from './context/SimpleAuthContext';

// 創建 Material-UI 主題
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// 簡單的調試頁面組件
const DebugHomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert severity="success" sx={{ mb: 2 }}>
        🎉 React 應用正常運行！
      </Alert>
      <Typography variant="h1" component="h1" gutterBottom>
        檔案切分工具 - 調試版本
      </Typography>
      <Typography variant="h2" component="h2" gutterBottom>
        基礎功能測試
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" gutterBottom>
          ✅ React Router v7 正常工作
        </Typography>
        <Typography variant="body1" gutterBottom>
          ✅ Material-UI 主題正常
        </Typography>
        <Typography variant="body1" gutterBottom>
          ✅ SimpleAuthContext 載入中...
        </Typography>
      </Box>
    </Container>
  );
};

const DebugLoginPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        登入頁面 - 調試版本
      </Typography>
      <Alert severity="info">
        這是登入頁面的簡化版本，用於測試路由功能。
      </Alert>
    </Container>
  );
};

function DebugApp() {
  console.log('DebugApp 開始渲染');
  
  try {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SimpleAuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<DebugLoginPage />} />
              <Route path="/" element={<DebugHomePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SimpleAuthProvider>
      </ThemeProvider>
    );
  } catch (error) {
    console.error('DebugApp 渲染錯誤:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>應用載入錯誤</h1>
        <p>請檢查瀏覽器控制台了解詳細錯誤信息。</p>
        <pre>{String(error)}</pre>
      </div>
    );
  }
}

export default DebugApp;