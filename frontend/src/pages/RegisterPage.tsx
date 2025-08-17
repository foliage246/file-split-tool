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
      setFormError('Please fill in all fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      setFormError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Password confirmation does not match');
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
      {/* Left side: Product highlights */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            Get Started Today
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Free registration to experience powerful file splitting features
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              Completely free, no credit card required
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              5 free processing quotas daily
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              Support 10MB CSV file uploads
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 2 }} />
              Start immediately, complete registration in 30 seconds
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Upgrade to premium anytime for Excel, TXT and more formats
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
          {/* Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Register
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Create your File Split Tool account
            </Typography>
          </Box>

          {/* 錯誤訊息 */}
          {(error || formError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || formError}
            </Alert>
          )}

          {/* Registration form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
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
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="new-password"
              helperText="Password must be at least 6 characters long"
            />

            <TextField
              fullWidth
              label="Confirm Password"
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
              Register
            </LoadingButton>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Login link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Already have an account?
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              startIcon={<LoginIcon />}
              size="large"
              fullWidth
            >
              Sign In to Existing Account
            </Button>
          </Box>

          {/* Terms notice */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              By registering, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};