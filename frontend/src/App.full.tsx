import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SimpleAuthProvider } from './context/SimpleAuthContext';
import { AppLayout } from './components/Layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PricingPage } from './pages/PricingPage';

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
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
  },
});

function FullApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SimpleAuthProvider>
        <Router>
          <AppContent />
        </Router>
      </SimpleAuthProvider>
    </ThemeProvider>
  );
}

const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* 登入和註冊頁面不使用 AppLayout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* 使用 AppLayout 包裝的其他頁面 */}
      <Route path="/*" element={
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      } />
    </Routes>
  );
};

export default FullApp;