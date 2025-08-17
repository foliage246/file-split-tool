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
  Divider,
  alpha,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Check,
  Star,
  Close,
  CreditCard,
  Security,
  Speed,
  TableChart,
} from '@mui/icons-material';
import { useAuth } from '../context/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService, handleApiError } from '../services/api';
import { PricingPlan, SubscriptionInfo } from '../types';

export const PricingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Default pricing plans if API fails
  const defaultPlans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: 'month',
      description: 'Perfect for getting started',
      features: [
        'CSV files only',
        '5 files per day',
        '10MB file size limit',
        'Basic support',
        'Auto-delete after 1 hour'
      ],
      limitations: [
        'No Excel/TXT support',
        'Limited daily usage',
        'Basic features only'
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      currency: 'USD',
      interval: 'month',
      description: 'For professional users',
      features: [
        'All file formats (CSV, Excel, TXT)',
        '50 files per day',
        '100MB file size limit',
        'Priority support',
        'Advanced encoding detection',
        'Bulk processing'
      ],
      limitations: [],
      popular: true,
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchPricingData();
    } else {
      setPlans(defaultPlans);
    }
  }, [isAuthenticated]);

  const fetchPricingData = async () => {
    try {
      const [pricingData, subscriptionData] = await Promise.all([
        apiService.getPricing().catch(() => ({ plans: defaultPlans, payment_methods: [] })),
        apiService.getSubscriptionStatus().catch(() => null),
      ]);
      
      setPlans(pricingData.plans.length > 0 ? pricingData.plans : defaultPlans);
      setSubscription(subscriptionData);
    } catch (err) {
      // Ignore errors and use default data
      setPlans(defaultPlans);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.is_premium) {
      setError('You are already a premium member');
      return;
    }

    setLoading(planId);
    setError(null);

    try {
      if (planId === 'free') {
        alert('You are already on the free plan!');
        return;
      }

      // This should integrate with Stripe payment form
      // For now, show a simple success message
      alert('Subscription created! Please complete the payment process.');
      
      // Refresh subscription data
      await fetchPricingData();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    const confirmed = window.confirm('Are you sure you want to cancel your subscription? You will return to free plan limitations.');
    if (!confirmed) return;

    setLoading('cancel');
    try {
      await apiService.cancelSubscription();
      alert('Subscription cancelled');
      await fetchPricingData();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(null);
    }
  };

  const isPlanCurrent = (planId: string) => {
    return (planId === 'premium' && user?.is_premium) || (planId === 'free' && !user?.is_premium);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 2 }}
            >
              Choose Your Plan
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}
            >
              Start with our free plan and upgrade anytime to unlock more features
            </Typography>

            {/* Current user status */}
            {isAuthenticated && user && (
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
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Pricing cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {plans.map((plan) => {
            const isCurrent = isPlanCurrent(plan.id);
            const isPopular = plan.popular;

            return (
              <Grid item xs={12} md={6} key={plan.id}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    border: isPopular ? '3px solid #1976d2' : '1px solid #e0e0e0',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    transform: isPopular ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                      transform: isPopular ? 'scale(1.07)' : 'scale(1.02)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1,
                      }}
                    >
                      <Chip
                        label="⭐ Most Popular"
                        sx={{
                          bgcolor: '#1976d2',
                          color: 'white',
                          fontWeight: 'bold',
                          px: 2,
                        }}
                      />
                    </Box>
                  )}

                  {/* Current plan badge */}
                  {isCurrent && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                      }}
                    >
                      <Chip
                        label="Current Plan"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  )}

                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    {/* Plan name and price */}
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      {plan.price > 0 && (
                        <Typography component="span" variant="h6" color="textSecondary">
                          /{plan.interval === 'month' ? 'month' : 'year'}
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>

                    {/* Features list */}
                    <List dense sx={{ mb: 3 }}>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Check sx={{ color: '#4caf50', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>

                    {/* Limitations */}
                    {plan.limitations && plan.limitations.length > 0 && (
                      <List dense sx={{ mb: 3 }}>
                        {plan.limitations.map((limitation, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Close sx={{ color: '#f44336', fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={limitation} 
                              sx={{ '& .MuiListItemText-primary': { color: 'text.secondary' } }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 4, pt: 0 }}>
                    {plan.id === 'free' ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        disabled={isCurrent}
                        sx={{ textTransform: 'none', py: 1.5 }}
                      >
                        {isCurrent ? 'Current Plan' : 'Get Started'}
                      </Button>
                    ) : (
                      <>
                        {user?.is_premium ? (
                          <LoadingButton
                            fullWidth
                            variant="outlined"
                            size="large"
                            loading={loading === 'cancel'}
                            onClick={handleCancelSubscription}
                            startIcon={<Close />}
                            sx={{ textTransform: 'none', py: 1.5 }}
                          >
                            Cancel Subscription
                          </LoadingButton>
                        ) : (
                          <LoadingButton
                            fullWidth
                            variant="contained"
                            size="large"
                            loading={loading === plan.id}
                            onClick={() => handleSubscribe(plan.id)}
                            startIcon={<CreditCard />}
                            sx={{
                              textTransform: 'none',
                              py: 1.5,
                              bgcolor: '#1976d2',
                              boxShadow: '0 4px 14px 0 rgba(25,118,210,0.4)',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px 0 rgba(25,118,210,0.6)',
                              },
                            }}
                          >
                            Upgrade Now
                          </LoadingButton>
                        )}
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Feature comparison */}
        <Paper sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
            Detailed Feature Comparison
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <TableChart sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  File Processing
                </Typography>
              </Box>
              <List dense>
                <ListItem>• Free: CSV format only</ListItem>
                <ListItem>• Premium: CSV, Excel, TXT</ListItem>
                <ListItem>• Auto-detect Big5, UTF-8 encoding</ListItem>
                <ListItem>• Single column value splitting</ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Speed sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Usage Limits
                </Typography>
              </Box>
              <List dense>
                <ListItem>• Free: 5 files/day, 10MB, CSV only</ListItem>
                <ListItem>• Premium: 50 files/day, 100MB, all formats</ListItem>
                <ListItem>• Results auto-delete after 1 hour</ListItem>
                <ListItem>• Optimized processing workflow</ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Security sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Security & Privacy
                </Typography>
              </Box>
              <List dense>
                <ListItem>• SSL encrypted data transfer</ListItem>
                <ListItem>• Automatic file deletion</ListItem>
                <ListItem>• No personal data storage</ListItem>
                <ListItem>• Privacy policy protection</ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* FAQ Section */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                How do I cancel my subscription?
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                You can cancel your subscription anytime on this page. After cancellation, you'll immediately return to free plan limitations, but it won't affect your current billing cycle.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                What payment methods are supported?
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                We support major credit and debit cards including Visa, Mastercard, and American Express.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                How is data security ensured?
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                All uploaded files are automatically deleted 1 hour after processing. We never store your file contents permanently.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                How do I report issues?
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                If you encounter any issues, please use the feedback feature in the system to submit relevant information. We'll improve it as soon as possible.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};