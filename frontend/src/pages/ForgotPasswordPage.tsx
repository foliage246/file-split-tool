import React, { useState } from 'react';
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
import { Email, ArrowBack } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { apiService, handleApiError } from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email address is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiService.forgotPassword({ email });
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
            <Email sx={{ fontSize: 64, color: '#1976d2', mb: 3 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Check Your Email
            </Typography>
            
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              We've sent a password reset link to <strong>{email}</strong>
            </Typography>

            <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
              If you don't see the email in your inbox, please check your spam folder.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none' }}
              >
                Back to Login
              </Button>
              
              <Button
                variant="text"
                onClick={() => setSuccess(false)}
                sx={{ textTransform: 'none' }}
              >
                Try Another Email
              </Button>
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
              Reset Instructions Sent
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Follow the link in your email to reset your password securely
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                • Check your email inbox
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                • Click the reset link
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                • Create a new secure password
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                • Sign in with your new password
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
            Forgot Password
          </Typography>
          
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4 }}>
            Enter your email address and we'll send you a link to reset your password
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleInputChange}
            />
            
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isLoading}
              startIcon={<Email />}
            >
              Send Reset Link
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
            Reset Your Password
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Secure password reset in just a few steps
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Enter your registered email address
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Check your email for reset instructions
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Create a new secure password
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Continue using your account safely
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