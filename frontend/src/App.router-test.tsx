import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Button, Box, AppBar, Toolbar } from '@mui/material';

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

// 簡單的頁面組件
const HomePage = () => {
  const location = useLocation();
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        檔案切分工具 - 首頁
      </Typography>
      <Typography variant="body1" gutterBottom>
        當前路徑: {location.pathname}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        這是一個測試 React Router v7 的最小版本。
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button component={Link} to="/login" variant="contained" sx={{ mr: 2 }}>
          前往登入頁
        </Button>
        <Button component={Link} to="/pricing" variant="outlined">
          前往定價頁
        </Button>
      </Box>
    </Box>
  );
};

const LoginPage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        登入頁面
      </Typography>
      <Typography variant="body1" gutterBottom>
        這是登入頁面，用於測試路由功能。
      </Typography>
      <Button component={Link} to="/" variant="outlined" sx={{ mt: 2 }}>
        返回首頁
      </Button>
    </Box>
  );
};

const PricingPage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        定價頁面
      </Typography>
      <Typography variant="body1" gutterBottom>
        這是定價頁面，用於測試路由功能。
      </Typography>
      <Button component={Link} to="/" variant="outlined" sx={{ mt: 2 }}>
        返回首頁
      </Button>
    </Box>
  );
};

const Navigation = () => {
  const location = useLocation();
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          檔案切分工具 - 路由測試
        </Typography>
        <Button color="inherit" component={Link} to="/">
          首頁
        </Button>
        <Button color="inherit" component={Link} to="/login">
          登入
        </Button>
        <Button color="inherit" component={Link} to="/pricing">
          定價
        </Button>
        <Typography variant="body2" sx={{ ml: 2 }}>
          當前: {location.pathname}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

function RouterTestApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="*" element={
              <Box sx={{ py: 4 }}>
                <Typography variant="h2">404 - 頁面未找到</Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
                  返回首頁
                </Button>
              </Box>
            } />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default RouterTestApp;