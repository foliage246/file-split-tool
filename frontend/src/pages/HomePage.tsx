import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
} from '@mui/material';
import { FileUploadStep } from '../components/FileUpload/FileUploadStep';
import { ColumnSelectionStep } from '../components/FileUpload/ColumnSelectionStep';
import { ProcessingStep } from '../components/FileUpload/ProcessingStep';
import { FileUploadData, UsageLimits } from '../types';
import { apiService, handleApiError } from '../services/api';
import { useAuth } from '../context/SimpleAuthContext';

const steps = ['上傳檔案', '選擇欄位', '處理結果'];

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadData, setUploadData] = useState<FileUploadData>({
    file: null,
    columnName: '',
    batchSize: undefined,
  });
  const [usageLimits, setUsageLimits] = useState<UsageLimits | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          請先登入以使用檔案切分功能
        </Alert>
      </Box>
    );
  }

  // 檢查使用限制
  if (usageLimits && usageLimits.daily_usage.remaining <= 0) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          您今日的處理次數已用完。
          {!usageLimits.user_tier || usageLimits.user_tier === 'free' ? 
            '升級到付費版可獲得更多處理次數。' : 
            '明日會重新計算使用次數。'
          }
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* 步驟指示器 */}
      <Paper sx={{ p: 3, mb: 4 }}>
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
          今日剩餘處理次數: {usageLimits.daily_usage.remaining} / {usageLimits.daily_usage.limit}
          {usageLimits.user_tier === 'free' && usageLimits.daily_usage.remaining <= 2 && (
            <>
              <br />
              考慮升級到付費版以獲得更多處理次數和更大的檔案支援。
            </>
          )}
        </Alert>
      )}

      {/* 步驟內容 */}
      <Paper sx={{ p: 4 }}>
        {renderStepContent()}
      </Paper>
    </Box>
  );
};