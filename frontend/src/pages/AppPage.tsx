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
} from '@mui/material';
import { FileUploadStep } from '../components/FileUpload/FileUploadStep';
import { ColumnSelectionStep } from '../components/FileUpload/ColumnSelectionStep';
import { ProcessingStep } from '../components/FileUpload/ProcessingStep';
import { FileUploadData, UsageLimits } from '../types';
import { apiService, handleApiError } from '../services/api';
import { useAuth } from '../context/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AppPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const [activeStep, setActiveStep] = useState(0);
  const [uploadData, setUploadData] = useState<FileUploadData>({
    file: null,
    columnName: '',
    batchSize: undefined,
  });
  const [usageLimits, setUsageLimits] = useState<UsageLimits | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const steps = [
    t('steps.upload'),
    t('steps.selectColumn'), 
    t('steps.processResults')
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

  // 檢查使用限制
  if (usageLimits && usageLimits.daily_usage.remaining <= 0) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            {t('page.dailyLimitExhausted')}
            {!usageLimits.user_tier || usageLimits.user_tier === 'free' ? 
              ` ${t('page.upgradeToPremium')}` : 
              ` ${t('page.quotaResetTomorrow')}`
            }
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* 頁面標題 */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}
        >
          {t('page.title')}
        </Typography>

        {/* 步驟指示器 */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* 錯誤訊息 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 使用限制提示 */}
        {usageLimits && activeStep === 0 && (
          <Alert 
            severity={usageLimits.daily_usage.remaining <= 2 ? "warning" : "info"} 
            sx={{ mb: 3 }}
          >
            {t('page.dailyUsageRemaining')}: {usageLimits.daily_usage.remaining} / {usageLimits.daily_usage.limit}
            {usageLimits.user_tier === 'free' && usageLimits.daily_usage.remaining <= 2 && (
              <>
                <br />
                {t('page.upgradePromotion')}
              </>
            )}
          </Alert>
        )}

        {/* 步驟內容 */}
        <Paper sx={{ p: 4, borderRadius: 2, minHeight: 400 }}>
          {renderStepContent()}
        </Paper>
      </Box>
    </Container>
  );
};