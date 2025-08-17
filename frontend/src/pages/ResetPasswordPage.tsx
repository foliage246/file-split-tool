import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Lock, CheckCircle, ArrowBack } from '@mui/icons-material';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { apiService, handleApiError } from '../services/api';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid or missing reset token. Please request a new password reset.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Password confirmation does not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiService.resetPassword({
        token,
        new_password: formData.password,
      });
      setSuccess(true);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#fafafa' }}>
        {/* Left side: Success message */}
        <Box
          sx={{
            flex: { xs: 1, md: 0.6 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Paper elevation={3} sx={{ p: 6, width: '100%', maxWidth: 500, borderRadius: 3, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 64, color: '#4caf50', mb: 3 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Password Reset Successful
            </Typography>
            
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              Your password has been successfully reset. You can now sign in with your new password.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none' }}
            >
              Sign In Now
            </Button>
          </Paper>
        </Box>

        {/* Right side: Success info */}
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
              Welcome Back!
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Your account is now secure with your new password
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                • Your password has been updated
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                • All devices have been logged out
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                • Use your new password to sign in
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                • Continue using all features safely
              </Typography>
            </Box>
          </Box>
          {/* Background decoration */}
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
      </Box>
    );
  }

  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#fafafa' }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Paper elevation={3} sx={{ p: 6, width: '100%', maxWidth: 500, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Invalid Reset Link
            </Typography>
            
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              This password reset link is invalid or has expired. Please request a new password reset.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/forgot-password')}
                sx={{ textTransform: 'none' }}
              >
                Request New Reset Link
              </Button>
              
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none' }}
              >
                Back to Login
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#fafafa' }}>
      {/* Left side: Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 6, width: '100%', maxWidth: 500, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Reset Password
          </Typography>
          
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4 }}>
            Enter your new password below
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              autoComplete="new-password"
              autoFocus
              value={formData.password}
              onChange={handleInputChange}
              helperText="Password must be at least 6 characters long"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isLoading}
              startIcon={<Lock />}
            >
              Reset Password
            </LoadingButton>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="text" startIcon={<ArrowBack />} sx={{ textTransform: 'none' }}>
                  Back to Login
                </Button>
              </RouterLink>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Right side: Info panel */}
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
            Create New Password
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Choose a strong password to keep your account secure
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Use at least 6 characters
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Include letters and numbers
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Avoid common passwords
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Keep it unique to this account
            </Typography>
          </Box>
        </Box>
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            left: -100,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
          }}
        />
      </Box>
    </Box>
  );
};