import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  Chip,
  alpha,
} from '@mui/material';
import {
  CloudUpload,
  TableChart,
  Speed,
  Security,
  GetApp,
  Star,
} from '@mui/icons-material';
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

  const features = [
    {
      icon: <TableChart sx={{ fontSize: 48, color: '#1976d2' }} />,
      title: 'Multiple Formats',
      description: 'Support CSV, Excel (.xlsx, .xls), and TXT files with automatic encoding detection',
    },
    {
      icon: <CloudUpload sx={{ fontSize: 48, color: '#1976d2' }} />,
      title: 'Easy to Use',
      description: 'Simple 3-step process: Upload your file, select column, download results',
    },
    {
      icon: <Speed sx={{ fontSize: 48, color: '#1976d2' }} />,
      title: 'Fast Processing',
      description: 'Quick file processing with instant download and automatic cleanup',
    },
    {
      icon: <Security sx={{ fontSize: 48, color: '#1976d2' }} />,
      title: 'Secure & Private',
      description: 'Files are automatically deleted after processing. No permanent storage.',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
        }}
      >
        {/* Header inside hero section */}
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              File Split Tool
            </Typography>
{!isAuthenticated && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/login')}
                  sx={{ 
                    textTransform: 'none',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    textTransform: 'none', 
                    bgcolor: 'white',
                    color: '#1976d2',
                    '&:hover': {
                      bgcolor: '#f5f5f5'
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
          <Grid container spacing={6} alignItems="center" sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Chip 
                label="⭐ Most Popular File Tool" 
                sx={{ 
                  mb: 3, 
                  bgcolor: alpha('#fff', 0.2), 
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Professional File Split Tool
              </Typography>
              
              <Typography
                variant="h5"
                component="p"
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.3rem' }
                }}
              >
                Advanced file splitting solution for CSV, Excel, and TXT files. 
                Split large files by column values with professional-grade accuracy.
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    mr: 2,
                    mb: { xs: 2, sm: 0 },
                    bgcolor: 'white',
                    color: '#1976d2',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px 0 rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={<GetApp />}
                >
                  Start Splitting Files
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/pricing')}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    borderColor: 'white',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: alpha('#fff', 0.1),
                    },
                  }}
                >
                  View Pricing
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex' }}>
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} sx={{ color: '#ffd700', fontSize: 20 }} />
                  ))}
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Trusted by 10,000+ users worldwide
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 400,
                    height: 300,
                    bgcolor: alpha('#fff', 0.1),
                    borderRadius: 4,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CloudUpload sx={{ fontSize: 80, mb: 2, opacity: 0.7 }} />
                  <Typography variant="h6" sx={{ opacity: 0.8 }}>
                    Drag & Drop Your Files
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.6, mt: 1 }}>
                    CSV • Excel • TXT
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Why Choose Our Tool?
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Professional-grade file splitting with enterprise security and lightning-fast processing
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  border: '1px solid #e0e0e0',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    borderColor: '#1976d2',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                10,000+
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Files Processed
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                99.9%
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Accuracy Rate
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                &lt;10s
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Average Processing Time
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Ready to Split Your Files?
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
            Join thousands of users who trust our platform for their file processing needs
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.3rem',
              textTransform: 'none',
              bgcolor: '#1976d2',
              boxShadow: '0 4px 14px 0 rgba(25,118,210,0.4)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px 0 rgba(25,118,210,0.6)',
              },
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 4, borderTop: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                File Splitting Tool
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Professional file splitting made simple and secure.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="text"
                  onClick={() => navigate('/pricing')}
                  sx={{ justifyContent: 'flex-start', p: 0, textTransform: 'none', color: 'textSecondary' }}
                >
                  Pricing
                </Button>
                <Button
                  variant="text"
                  onClick={() => navigate('/terms')}
                  sx={{ justifyContent: 'flex-start', p: 0, textTransform: 'none', color: 'textSecondary' }}
                >
                  Terms & Conditions
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Contact
              </Typography>
              <Typography variant="body2" color="textSecondary">
                contact.floweasy@gmail.com
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="body2" color="textSecondary">
              © 2025 File Splitting Tool. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};