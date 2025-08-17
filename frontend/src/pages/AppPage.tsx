import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  Typography,
  Container,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  alpha,
} from '@mui/material';
import { AccountCircle, ExitToApp, Home } from '@mui/icons-material';
import { FileUploadStep } from '../components/FileUpload/FileUploadStep';
import { ColumnSelectionStep } from '../components/FileUpload/ColumnSelectionStep';
import { ProcessingStep } from '../components/FileUpload/ProcessingStep';
import { FileUploadData, UsageLimits } from '../types';
import { apiService, handleApiError } from '../services/api';
import { useAuth } from '../context/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';

export const AppPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadData, setUploadData] = useState<FileUploadData>({
    file: null,
    columnName: '',
    batchSize: undefined,
  });
  const [usageLimits, setUsageLimits] = useState<UsageLimits | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const steps = [
    'Upload File',
    'Select Column', 
    'Process Results'
  ];

  // 檢查用戶是否已登入
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  // 獲取用戶使用限制
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsageLimits();
    }
  }, [isAuthenticated]);

  const fetchUsageLimits = async () => {
    try {
      const limits = await apiService.getUsageLimits();
      setUsageLimits(limits);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setError(null);
  };

  const handlePrevious = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError(null);
  };

  const handleDataChange = (newData: Partial<FileUploadData>) => {
    setUploadData((prev) => ({ ...prev, ...newData }));
  };

  const handleReset = () => {
    setActiveStep(0);
    setUploadData({
      file: null,
      columnName: '',
      batchSize: undefined,
    });
    setError(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <FileUploadStep
            activeStep={activeStep}
            onNext={handleNext}
            onPrevious={handlePrevious}
            data={uploadData}
            onDataChange={handleDataChange}
            usageLimits={usageLimits || undefined}
          />
        );
      case 1:
        return (
          <ColumnSelectionStep
            activeStep={activeStep}
            onNext={handleNext}
            onPrevious={handlePrevious}
            data={uploadData}
            onDataChange={handleDataChange}
          />
        );
      case 2:
        return (
          <ProcessingStep
            activeStep={activeStep}
            onNext={handleNext}
            onPrevious={handlePrevious}
            data={uploadData}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  // 如果未登入，不渲染內容
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Header Section */}
      <AppBar position="static" sx={{ 
        bgcolor: 'white', 
        color: '#1976d2',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            File Split Tool
          </Typography>

          {isAuthenticated && user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* User tier badge */}
              <Chip
                label={user.is_premium ? 'Premium' : 'Free'}
                color={user.is_premium ? 'success' : 'default'}
                size="small"
                variant="filled"
                sx={{
                  bgcolor: user.is_premium ? '#4caf50' : '#e0e0e0',
                  color: 'white',
                }}
              />

              {/* Upgrade button */}
              {!user.is_premium && (
                <Button
                  color="warning"
                  variant="contained"
                  size="small"
                  onClick={handleUpgrade}
                  sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#e68900' } }}
                >
                  Upgrade
                </Button>
              )}

              {/* User menu */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ color: '#1976d2' }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {user.email}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user.is_premium ? 'Premium Member' : 'Free Member'}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/'); }}>
                  <Home sx={{ mr: 1 }} />
                  Home
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/pricing'); }}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Pricing
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              sx={{ color: '#1976d2' }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 2 }}
            >
              File Split Tool
            </Typography>
            <Typography
              variant="h6"
              sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}
            >
              Upload, select column, and process your files in three simple steps
            </Typography>

            {/* Current user status */}
            {user && (
              <Chip
                label={`Current Plan: ${user.is_premium ? 'Premium' : 'Free'}`}
                sx={{
                  mt: 3,
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Check usage limits */}
        {usageLimits && usageLimits.daily_usage.remaining <= 0 && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            Your daily processing quota has been exhausted.
            {!usageLimits.user_tier || usageLimits.user_tier === 'free' ? 
              ' Upgrade to premium for more processing quota.' : 
              ' Quota will reset tomorrow.'
            }
          </Alert>
        )}

        {/* Progress stepper */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Usage limits reminder */}
        {usageLimits && activeStep === 0 && (
          <Alert 
            severity={usageLimits.daily_usage.remaining <= 2 ? "warning" : "info"} 
            sx={{ mb: 4 }}
          >
            Daily usage remaining: {usageLimits.daily_usage.remaining} / {usageLimits.daily_usage.limit}
            {usageLimits.user_tier === 'free' && usageLimits.daily_usage.remaining <= 2 && (
              <>
                <br />
                Consider upgrading to premium for more processing quota and larger file support.
              </>
            )}
          </Alert>
        )}

        {/* Step content */}
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3, 
          minHeight: 500,
          border: '1px solid #e0e0e0',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }
        }}>
          {renderStepContent()}
        </Paper>
      </Container>
    </Box>
  );
};