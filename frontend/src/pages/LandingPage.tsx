import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CloudUpload,
  TableChart,
  Download,
  Security,
  Speed,
  CheckCircle,
  Star,
  Close,
  PlayArrow,
  GetApp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/SimpleAuthContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';


export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation(['landing', 'common']);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // 使用翻譯的動態數據
  const steps = [
    t('howItWorks.step1.title'),
    t('howItWorks.step2.title'),
    t('howItWorks.step3.title'),
  ];

  const useCases = [
    t('howItWorks.step1.description'),
    t('howItWorks.step2.description'), 
    t('howItWorks.step3.description'),
  ];

  const features = [
    {
      icon: <CloudUpload sx={{ fontSize: 48, color: '#1976d2' }} />,
      title: t('features.csvSupport.title'),
      description: t('features.csvSupport.description'),
    },
    {
      icon: <TableChart sx={{ fontSize: 48, color: '#1976d2' }} />,
      title: t('features.smartSplit.title'),
      description: t('features.smartSplit.description'),
    },
    {
      icon: <Speed sx={{ fontSize: 48, color: '#1976d2' }} />,
      title: t('features.fastProcess.title'),
      description: t('features.fastProcess.description'),
    },
    {
      icon: <Download sx={{ fontSize: 48, color: '#1976d2' }} />,
      title: t('features.easyDownload.title'),
      description: t('features.easyDownload.description'),
    },
    {
      icon: <Security sx={{ fontSize: 48, color: '#1976d2' }} />,
      title: t('features.secureProcess.title'),
      description: t('features.secureProcess.description'),
    },
    {
      icon: <CheckCircle sx={{ fontSize: 48, color: '#1976d2' }} />,
      title: t('features.multiFormat.title'),
      description: t('features.multiFormat.description'),
    },
  ];

  const pricingPlans = [
    {
      name: t('pricing.free.name'),
      price: t('pricing.free.price'),
      features: t('pricing.free.features', { returnObjects: true }) as string[],
      limitations: t('pricing.free.limitations', { returnObjects: true }) as string[],
      button: t('pricing.free.button'),
    },
    {
      name: t('pricing.premium.name'),
      price: t('pricing.premium.price'),
      period: t('pricing.premium.period'),
      popular: t('pricing.premium.popular'),
      features: t('pricing.premium.features', { returnObjects: true }) as string[],
      button: t('pricing.premium.button'),
    },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      setAuthDialogOpen(true);
    }
  };

  const handleAuthChoice = (action: 'login' | 'register') => {
    setAuthDialogOpen(false);
    navigate(`/${action}`);
  };

  const demoNext = () => {
    setDemoStep((prev) => (prev + 1) % steps.length);
  };

  return (
    <Box>
      {/* 頂部語言切換器 */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <LanguageSwitcher variant="button" size="small" />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                {t('hero.title')}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                {t('hero.subtitle')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
                {t('hero.description')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: 'white',
                    color: '#1976d2',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#f5f5f5' },
                  }}
                  startIcon={<PlayArrow />}
                >
                  {t('hero.startButton')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/pricing')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  {t('common:nav.pricing')}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* 功能演示區域 */}
              <Paper
                elevation={8}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                  {t('demo.title')}
                </Typography>
                <Stepper activeStep={demoStep} alternativeLabel sx={{ mb: 3 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={demoNext}
                    startIcon={<PlayArrow />}
                    sx={{ px: 3 }}
                  >
                    {t('demo.downloadZip')}
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" align="center">
                  🎯 {t('demo.subtitle')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 功能特色 */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          {t('features.title')}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          {t('features.subtitle')}
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 使用案例 */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 6 }}
          >
            {t('howItWorks.title')}
          </Typography>
          <Grid container spacing={3}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: 4 },
                  }}
                >
                  <CheckCircle sx={{ color: '#4caf50', mr: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {useCase}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 方案對比 */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 6 }}
        >
          {t('pricing.title')}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={5} key={index}>
              <Card
                elevation={plan.popular ? 8 : 3}
                sx={{
                  height: '100%',
                  position: 'relative',
                  border: plan.popular ? '2px solid #1976d2' : 'none',
                }}
              >
                {plan.popular && (
                  <Chip
                    label={t('pricing.premium.popularLabel')}
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 'bold',
                    }}
                  />
                )}
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {plan.name}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h2" component="span" sx={{ fontWeight: 'bold' }}>
                      {plan.price}
                    </Typography>
                    {plan.period && plan.price !== t('pricing.free.price') && (
                      <Typography variant="h6" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        {plan.period}
                      </Typography>
                    )}
                  </Box>
                  <List sx={{ mb: 3 }}>
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant={plan.popular ? 'contained' : 'outlined'}
                    size="large"
                    fullWidth
                    onClick={handleGetStarted}
                    sx={{ py: 1.5, fontSize: '1.1rem' }}
                  >
                    {plan.button}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: '#1976d2',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            {t('cta.title')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            {t('cta.subtitle')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: 'white',
              color: '#1976d2',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
            startIcon={<GetApp />}
          >
            {t('cta.button')}
          </Button>
        </Container>
      </Box>

      {/* 認證選擇對話框 */}
      <Dialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
          {t('authDialog.title')}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {t('authDialog.subtitle')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => handleAuthChoice('login')}
                sx={{ py: 2 }}
              >
                {t('authDialog.existingAccount')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => handleAuthChoice('register')}
                sx={{ py: 2 }}
              >
                {t('authDialog.newAccount')}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setAuthDialogOpen(false)} color="inherit">
            {t('authDialog.continueBrowsing')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};