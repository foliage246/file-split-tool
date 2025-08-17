import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Button, Box, Card, CardContent } from '@mui/material';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            sx={{ minWidth: 150 }}
          >
            開始使用
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            sx={{ minWidth: 150 }}
          >
            了解更多
          </Button>
        </Box>

        {/* 使用步驟 */}
        <Box mt={8}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            簡單三步驟
          </Typography>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={3} mt={4}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  1️⃣ 上傳檔案
                </Typography>
                <Typography color="text.secondary">
                  選擇您要分割的 CSV 檔案
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  2️⃣ 選擇欄位
                </Typography>
                <Typography color="text.secondary">
                  選擇用於分割的資料欄位
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  3️⃣ 下載結果
                </Typography>
                <Typography color="text.secondary">
                  獲取分割後的 ZIP 檔案
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;