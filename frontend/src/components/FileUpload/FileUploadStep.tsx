import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  CheckCircle,
  Error as ErrorIcon,
  Info,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { StepProps, FileUploadData } from '../../types';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface FileUploadStepProps extends StepProps {
  data: FileUploadData;
  onDataChange: (data: Partial<FileUploadData>) => void;
  usageLimits?: {
    daily_usage: { current: number; limit: number; remaining: number };
    file_limits: { max_size_mb: number; supported_formats: string[] };
  };
}

export const FileUploadStep: React.FC<FileUploadStepProps> = ({
  onNext,
  data,
  onDataChange,
  usageLimits,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedExtensions = ['.csv', '.xlsx', '.xls', '.txt'];
  const maxSizeLimit = usageLimits?.file_limits.max_size_mb || 10;

  const handleFileSelect = (file: File) => {
    setError(null);

    // 檢查檔案類型
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!supportedExtensions.includes(fileExtension)) {
      setError(`不支援的檔案類型。支援格式: ${supportedExtensions.join(', ')}`);
      return;
    }

    // 檢查檔案大小
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeLimit) {
      setError(`檔案過大。最大支援 ${maxSizeLimit}MB`);
      return;
    }

    onDataChange({ file });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleNext = () => {
    if (!data.file) {
      setError('請選擇要上傳的檔案');
      return;
    }
    onNext();
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        步驟 1: 上傳檔案
      </Typography>

      {/* 使用量提示 */}
      {usageLimits && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            今日剩餘處理次數: {usageLimits.daily_usage.remaining} / {usageLimits.daily_usage.limit}
          </Typography>
          <Typography variant="body2">
            檔案大小限制: {usageLimits.file_limits.max_size_mb}MB
          </Typography>
        </Alert>
      )}

      {/* 檔案上傳區域 */}
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          border: dragOver ? '2px dashed #1976d2' : '2px dashed #ccc',
          bgcolor: dragOver ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          mb: 3,
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUpload sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          拖拽檔案到此處或點擊選擇檔案
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          支援格式: CSV, Excel (.xlsx, .xls), TXT
        </Typography>
        <Typography variant="body2" color="textSecondary">
          最大檔案大小: {maxSizeLimit}MB
        </Typography>

        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
          sx={{ mt: 2 }}
          onClick={(e) => e.stopPropagation()}
        >
          選擇檔案
          <VisuallyHiddenInput
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.txt"
            onChange={handleFileInputChange}
          />
        </Button>
      </Paper>

      {/* 已選擇的檔案 */}
      {data.file && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(76, 175, 80, 0.04)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <InsertDriveFile color="primary" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {data.file.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatFileSize(data.file.size)}
              </Typography>
            </Box>
            <CheckCircle color="success" />
          </Box>
        </Paper>
      )}

      {/* 錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 支援格式說明 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          支援的檔案格式：
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="CSV 檔案 (.csv)"
              secondary="支援 UTF-8、Big5、GB2312 等多種編碼"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Excel 檔案 (.xlsx, .xls)"
              secondary="Microsoft Excel 格式"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="文字檔 (.txt)"
              secondary="純文字檔案，支援各種分隔符"
            />
          </ListItem>
        </List>
      </Box>

      {/* 下一步按鈕 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!data.file}
          size="large"
        >
          下一步
        </Button>
      </Box>
    </Box>
  );
};