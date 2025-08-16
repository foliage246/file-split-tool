import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Button, Box } from '@mui/material';

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

function SimpleApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            檔案切分工具
          </Typography>
          <Typography variant="h2" component="h2" gutterBottom>
            測試版本 - 簡化界面
          </Typography>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            登入
          </Button>
          <Button variant="outlined" color="secondary">
            註冊
          </Button>
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1">
              如果您能看到這個完整的頁面，說明 Material-UI 工作正常。
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              問題可能出在 React Router 或 AuthContext 中。
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SimpleApp;