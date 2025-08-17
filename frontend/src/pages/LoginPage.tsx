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
import { Login as LoginIcon } from '@mui/icons-material';
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formError) setFormError(null);
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setFormError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    if (!formData.password) {
      setFormError('Password is required');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/app');
    } catch (err) {
      // Error handled by auth context
    }
  };

  const displayError = formError || error;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#fafafa' }}>
      {/* Left side: Login form */}
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
            Login
          </Typography>
          
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4 }}>
            Sign in to access the file split tool
          </Typography>

          {displayError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {displayError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
            />
            
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isLoading}
              startIcon={<LoginIcon />}
            >
              Sign In
            </LoadingButton>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <RouterLink to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Button variant="text" size="small" sx={{ textTransform: 'none' }}>
                  Forgot your password?
                </Button>
              </RouterLink>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                  <Button variant="text" size="small">
                    Register Now
                  </Button>
                </RouterLink>
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <RouterLink to="/" style={{ textDecoration: 'none' }}>
                <Button variant="text" size="small">
                  Back to Home
                </Button>
              </RouterLink>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Right side: Product highlights */}
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
            Continue your file processing journey
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Process multiple file formats
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Fast and secure file splitting
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Track your usage and history
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              • Upgrade for premium features
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