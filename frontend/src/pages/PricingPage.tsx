import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Paper,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Check,
  Star,
  Close,
  CreditCard,
} from '@mui/icons-material';
import { useAuth } from '../context/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService, handleApiError } from '../services/api';
import { PricingPlan, SubscriptionInfo } from '../types';

export const PricingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPricingData();
    if (isAuthenticated) {
      fetchSubscriptionInfo();
    }
  }, [isAuthenticated]);

  const fetchPricingData = async () => {
    try {
      const data = await apiService.getPricing();
      setPlans(data.plans);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const fetchSubscriptionInfo = async () => {
    try {
      const info = await apiService.getSubscriptionStatus();
      setSubscriptionInfo(info);
    } catch (err) {
      // 忽略獲取訂閱資訊的錯誤
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (subscriptionInfo?.is_premium) {
      setError('您已經是付費會員');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.createSubscription();
      
      if (result.client_secret) {
        // 這裡應該整合 Stripe 的付款表單
        // 現在先簡單地顯示成功訊息
        alert('訂閱創建成功！請完成付款流程。');
        await fetchSubscriptionInfo();
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionInfo?.is_premium) {
      return;
    }

    const confirmed = window.confirm('確定要取消訂閱嗎？取消後將回到免費版限制。');
    if (!confirmed) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiService.cancelSubscription();
      alert('訂閱已取消');
      await fetchSubscriptionInfo();
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* 標題 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            選擇適合您的方案
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
            從免費版開始，隨時升級以獲得更多功能
          </Typography>

          {/* 當前用戶狀態 */}
          {isAuthenticated && user && (
            <Chip
              label={`當前方案: ${user.is_premium ? '付費版' : '免費版'}`}
              color={user.is_premium ? 'success' : 'default'}
              size="large"
              sx={{ mb: 3 }}
            />
          )}
        </Box>

        {/* 錯誤訊息 */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* 價格方案卡片 */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {plans.map((plan, index) => {
            const isFreePlan = plan.price === 0;
            const isPremiumPlan = plan.price > 0;
            const isCurrentPlan = isAuthenticated && (
              (isFreePlan && !user?.is_premium) ||
              (isPremiumPlan && user?.is_premium)
            );

            return (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    border: isCurrentPlan ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    boxShadow: isPremiumPlan ? 4 : 1,
                  }}
                >
                  {/* 推薦標籤 */}
                  {isPremiumPlan && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'warning.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                      }}
                    >
                      推薦方案
                    </Box>
                  )}

                  {/* 當前方案標籤 */}
                  {isCurrentPlan && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                      }}
                    >
                      <Chip
                        label="當前方案"
                        color="primary"
                        size="small"
                        icon={<Star />}
                      />
                    </Box>
                  )}

                  <CardContent sx={{ p: 4 }}>
                    {/* 方案名稱和價格 */}
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {plan.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                        {plan.price === 0 ? '免費' : `$${plan.price} ${plan.currency || 'USD'}`}
                      </Typography>
                      {plan.price > 0 && (
                        <Typography variant="h6" color="textSecondary" sx={{ ml: 1 }}>
                          / {plan.interval === 'month' ? '月' : '年'}
                        </Typography>
                      )}
                    </Box>

                    {/* 功能列表 */}
                    <List sx={{ mb: 3 }}>
                      {plan.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Check color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>

                    {/* 限制說明 */}
                    {plan.limitations.length > 0 && (
                      <List>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <ListItem key={limitIndex} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Close color="action" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={limitation} 
                              sx={{ color: 'text.secondary' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 4, pt: 0 }}>
                    {!isAuthenticated ? (
                      <Button
                        fullWidth
                        variant={isPremiumPlan ? 'contained' : 'outlined'}
                        size="large"
                        onClick={() => navigate('/register')}
                      >
                        開始使用
                      </Button>
                    ) : isCurrentPlan ? (
                      <>
                        {isPremiumPlan ? (
                          <LoadingButton
                            fullWidth
                            variant="outlined"
                            color="error"
                            size="large"
                            loading={isLoading}
                            onClick={handleCancelSubscription}
                          >
                            取消訂閱
                          </LoadingButton>
                        ) : (
                          <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            disabled
                          >
                            當前方案
                          </Button>
                        )}
                      </>
                    ) : isPremiumPlan && !user?.is_premium ? (
                      <LoadingButton
                        fullWidth
                        variant="contained"
                        size="large"
                        loading={isLoading}
                        startIcon={<CreditCard />}
                        onClick={handleSubscribe}
                      >
                        立即升級
                      </LoadingButton>
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        disabled={user?.is_premium}
                      >
                        {user?.is_premium ? '已升級' : '降級到此方案'}
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* 功能對比表 */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            功能詳細對比
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                檔案處理
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • 免費版：僅支援 CSV 格式
                <br />
                • 付費版：CSV、Excel、TXT
                <br />
                • 自動識別 Big5、UTF-8 編碼
                <br />
                • 單欄位值自動切分
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                使用限制
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • 免費版：5 次/日，10MB，僅CSV
                <br />
                • 付費版：50 次/日，100MB，多格式
                <br />
                • 處理結果 1 小時後自動刪除
                <br />
                • 自動優化處理流程
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                安全保障
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • SSL 加密資料傳輸
                <br />
                • 檔案自動刪除保護
                <br />
                • 不保存個人資料
                <br />
                • 隱私政策保護
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* 常見問題 */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            常見問題
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                如何取消訂閱？
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                您可以隨時在此頁面取消訂閱，取消後會立即回到免費版限制，但不會影響當前計費週期內的使用。
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                支援哪些付款方式？
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                我們支援主要的信用卡和金融卡，包括 Visa、Mastercard、American Express 等。
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                資料安全如何保障？
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                所有上傳的檔案會在處理完成 1 小時後自動刪除，我們不會保存您的檔案內容。
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                如何報告問題？
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                如果遇到使用問題，可以透過系統內的問題回報功能提交相關資訊，我們會儘快改善。
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};