import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/SimpleAuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            File Split Tool
          </Typography>
          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={() => navigate('/app')}>
              Go to App
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 12,
            textAlign: 'center',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4 }}
          >
            Split Files by Column Values
          </Typography>
          
          <Typography
            variant="h5"
            component="p"
            color="textSecondary"
            sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
          >
            Easily split CSV, Excel, and TXT files based on column values. 
            Free tier supports CSV files, premium supports all formats.
          </Typography>

          <Box sx={{ mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.2rem',
                mr: 2,
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/pricing')}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.2rem',
              }}
            >
              View Pricing
            </Button>
          </Box>

          {/* Features */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
              Features
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
                <Typography variant="h6" gutterBottom>
                  Multiple Formats
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Support CSV, Excel (.xlsx, .xls), and TXT files
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
                <Typography variant="h6" gutterBottom>
                  Easy to Use
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Simple 3-step process: Upload, Select, Download
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
                <Typography variant="h6" gutterBottom>
                  Fast Processing
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Quick file processing with instant download
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};