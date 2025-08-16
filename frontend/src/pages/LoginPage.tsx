import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Divider,
  Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Login as LoginIcon, PersonAdd, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../context/SimpleAuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { login, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本驗證
    if (!formData.email || !formData.password) {
      setFormError('請填寫所有欄位');
      return;
    }

    if (!formData.email.includes('@')) {
      setFormError('請輸入有效的電子郵件地址');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      // 錯誤已經在 AuthContext 中處理
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* 左側：產品亮點 */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#1976d2',
          color: 'white',
          p: 6,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            檔案切分工具
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            智能檔案處理，讓數據整理變得簡單高效
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              免費版支援 CSV 格式
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              智能識別 Big5、UTF-8 編碼
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              按欄位內容自動切分檔案
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              免費版每日 5 次處理
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            已有超過 1,000+ 用戶信賴我們的檔案處理服務
          </Typography>
        </Box>
        {/* 背景裝飾 */}
        <Box
          sx={{
            position: 'absolute',
            right: -100,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
          }}
        />
      </Box>

      {/* 右側：登入表單 */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          bgcolor: '#fafafa',
        }}
      >
        <Paper sx={{ p: 6, width: '100%', maxWidth: 500, borderRadius: 3 }}>
          {/* 標題 */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              登入
            </Typography>
            <Typography variant="body1" color="textSecondary">
              登入您的檔案切分工具帳戶
            </Typography>
          </Box>

          {/* 錯誤訊息 */}
          {(error || formError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || formError}
            </Alert>
          )}

          {/* 登入表單 */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="電子郵件"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
            />

            <TextField
              fullWidth
              label="密碼"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="current-password"
            />

            <LoadingButton
              fullWidth
              type="submit"
              variant="contained"
              loading={isLoading}
              loadingPosition="start"
              startIcon={<LoginIcon />}
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              登入
            </LoadingButton>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 註冊連結 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              還沒有帳戶？
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              startIcon={<PersonAdd />}
              size="large"
              fullWidth
            >
              註冊新帳戶
            </Button>
          </Box>

          {/* 安全說明 */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(76, 175, 80, 0.04)', borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              🔒 安全保證
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 所有資料傳輸均採用 SSL 加密
              <br />
              • 檔案處理完成後自動刪除
              <br />
              • 不會保存您的個人資料
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};