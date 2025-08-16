import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PersonAdd, Login as LoginIcon, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../context/SimpleAuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const { register, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
    clearError();
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('請填寫所有欄位');
      return false;
    }

    if (!formData.email.includes('@')) {
      setFormError('請輸入有效的電子郵件地址');
      return false;
    }

    if (formData.password.length < 6) {
      setFormError('密碼長度至少需要 6 個字元');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('密碼確認不匹配');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData.email, formData.password);
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
          bgcolor: '#2e7d32',
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
            立即開始使用
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            免費註冊，馬上體驗強大的檔案切分功能
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              完全免費，無需信用卡
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              每日 5 次免費處理額度
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              支援 10MB CSV 檔案上傳
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              立即開始，30秒完成註冊
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            隨時可升級到付費版，支援 Excel、TXT 等更多格式
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

      {/* 右側：註冊表單 */}
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
              註冊
            </Typography>
            <Typography variant="body1" color="textSecondary">
              創建您的檔案切分工具帳戶
            </Typography>
          </Box>

          {/* 錯誤訊息 */}
          {(error || formError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || formError}
            </Alert>
          )}

          {/* 註冊表單 */}
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
              autoComplete="new-password"
              helperText="密碼長度至少需要 6 個字元"
            />

            <TextField
              fullWidth
              label="確認密碼"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="new-password"
            />

            <LoadingButton
              fullWidth
              type="submit"
              variant="contained"
              loading={isLoading}
              loadingPosition="start"
              startIcon={<PersonAdd />}
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              註冊
            </LoadingButton>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 登入連結 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              已經有帳戶？
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              startIcon={<LoginIcon />}
              size="large"
              fullWidth
            >
              登入現有帳戶
            </Button>
          </Box>

          {/* 條款說明 */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              註冊即表示您同意我們的服務條款和隱私政策
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};