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
import { useAuth } from '../context/SimpleAuthContext';

const steps = ['上傳檔案', '選擇切分欄位', '下載處理結果'];

const features = [
  {
    icon: <CloudUpload sx={{ fontSize: 48, color: '#1976d2' }} />,
    title: '支援CSV格式',
    description: '支援 CSV 檔案處理，自動識別 Big5、UTF-8 等多種編碼格式',
  },
  {
    icon: <TableChart sx={{ fontSize: 48, color: '#1976d2' }} />,
    title: '智能欄位切分',
    description: '選擇任意欄位，按照欄位內容自動切分成多個檔案，保持原始格式和結構',
  },
  {
    icon: <Speed sx={{ fontSize: 48, color: '#1976d2' }} />,
    title: '快速處理',
    description: '高效的後端處理引擎，CSV檔案能在短時間內完成切分處理',
  },
];

const useCases = [
  '客戶資料按地區分類',
  '銷售數據按月份切分',
  '產品清單按類別整理',
  '員工資料按部門分組',
  '訂單記錄按狀態分類',
  '庫存資料按倉庫切分',
];

const pricingPlans = [
  {
    name: '免費版',
    price: 0,
    currency: 'USD',
    features: [
      '每日 5 次處理',
      '最大 10MB 檔案',
      '支援 CSV 格式',
      '基本功能使用',
    ],
    limitations: [
      '處理次數有限',
      '檔案大小限制',
      '僅支援 CSV 格式',
    ],
  },
  {
    name: '付費版',
    price: 9.99,
    currency: 'USD',
    features: [
      '每日 50 次處理',
      '最大 100MB 檔案',
      '支援 CSV、Excel、TXT',
      '完整功能使用',
      '處理歷史記錄',
    ],
    limitations: [],
    popular: true,
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

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
                檔案切分工具
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                智能檔案切分，讓數據整理變得簡單高效
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
                專業的 CSV 檔案處理工具，按欄位內容自動切分檔案，
                保持原始結構，一鍵完成大批量數據整理工作。
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
                  立即開始使用
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
                  查看方案
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
                  操作流程演示
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
                    下一步演示
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" align="center">
                  🎯 簡單三步驟，輕鬆完成檔案切分
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
          sx={{ fontWeight: 'bold', mb: 6 }}
        >
          為什麼選擇我們的工具？
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
            適用場景
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
          選擇適合的方案
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
                    label="推薦方案"
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
                      {plan.price === 0 ? '免費' : `$${plan.price} USD`}
                    </Typography>
                    {plan.price > 0 && (
                      <Typography variant="h6" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        /月
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
                    {plan.price === 0 ? '免費使用' : '開始試用'}
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
            準備開始了嗎？
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            立即註冊，免費使用檔案切分工具，體驗高效的數據處理流程
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
            免費開始使用
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
          開始使用檔案切分工具
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" sx={{ mb: 4 }}>
            請選擇登入方式來使用我們的檔案處理工具
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
                已有帳號登入
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
                註冊新帳號
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setAuthDialogOpen(false)} color="inherit">
            繼續瀏覽
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};