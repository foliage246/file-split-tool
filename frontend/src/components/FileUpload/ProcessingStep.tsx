import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Alert,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  Download,
  InsertDriveFile,
  Refresh,
  Schedule,
  Speed,
} from '@mui/icons-material';
import { StepProps, FileUploadData, TaskStatus } from '../../types';
import { apiService, handleApiError } from '../../services/api';

interface ProcessingStepProps extends StepProps {
  data: FileUploadData;
  onReset: () => void;
}

export const ProcessingStep: React.FC<ProcessingStepProps> = ({
  data,
  onReset,
}) => {
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (data.file && data.columnName) {
      startProcessing();
    }
  }, [data.file, data.columnName]);

  const startProcessing = async () => {
    if (!data.file || !data.columnName) return;

    try {
      setError(null);
      
      // 上傳檔案並開始處理
      const response = await apiService.uploadFile(
        data.file,
        data.columnName,
        data.batchSize
      );

      // 開始輪詢任務狀態
      if (response.task_id) {
        setIsPolling(true);
        pollTaskStatus(response.task_id);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    try {
      const status = await apiService.getTaskStatus(taskId);
      setTaskStatus(status);

      // 如果任務仍在處理中，繼續輪詢
      if (status.status === 'pending' || status.status === 'processing') {
        setTimeout(() => pollTaskStatus(taskId), 2000); // 每2秒檢查一次
      } else {
        setIsPolling(false);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setIsPolling(false);
    }
  };

  const handleDownload = async () => {
    if (!taskStatus?.task_id) return;

    try {
      const blob = await apiService.downloadResult(taskStatus.task_id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${taskStatus.filename}_split_results.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '等待處理';
      case 'processing':
        return '處理中';
      case 'completed':
        return '處理完成';
      case 'failed':
        return '處理失敗';
      default:
        return '未知狀態';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Schedule color="warning" />;
      case 'processing':
        return <Speed color="info" />;
      case 'completed':
        return <CheckCircle color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return <Schedule />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        步驟 3: 處理結果
      </Typography>

      {/* 處理狀態卡片 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {taskStatus && getStatusIcon(taskStatus.status)}
            <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
              檔案處理狀態
            </Typography>
            {taskStatus && (
              <Chip
                label={getStatusText(taskStatus.status)}
                color={getStatusColor(taskStatus.status) as any}
                variant="outlined"
              />
            )}
          </Box>

          {taskStatus && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  檔案名稱
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {taskStatus.filename}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  檔案大小
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {taskStatus.file_size_mb} MB
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  切分欄位
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {taskStatus.column_name}
                </Typography>
              </Grid>
              {taskStatus.batch_size && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    批次大小
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {taskStatus.batch_size} 行
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}

          {/* 進度條 */}
          {isPolling && taskStatus?.status === 'processing' && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" gutterBottom>
                正在處理檔案...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 處理結果詳情 */}
      {taskStatus?.status === 'completed' && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              處理完成
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {taskStatus.total_rows}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    總行數
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(25, 118, 210, 0.1)' }}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {taskStatus.split_groups}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    切分群組
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {taskStatus.output_files}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    輸出檔案
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* 檔案詳情列表 */}
            {taskStatus.file_details && taskStatus.file_details.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  生成的檔案詳情：
                </Typography>
                <List>
                  {taskStatus.file_details.map((file, index) => (
                    <ListItem key={index} divider={index < taskStatus.file_details!.length - 1}>
                      <ListItemIcon>
                        <InsertDriveFile color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.filename}
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              群組值: {file.group_value} • 資料行數: {file.row_count}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* 下載按鈕 */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Download />}
                onClick={handleDownload}
                color="success"
              >
                下載處理結果 (ZIP)
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* 失敗訊息 */}
      {taskStatus?.status === 'failed' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            處理失敗
          </Typography>
          <Typography variant="body2">
            {taskStatus.error_message || '檔案處理過程中發生錯誤'}
          </Typography>
        </Alert>
      )}

      {/* 一般錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 操作按鈕 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onReset}
          size="large"
        >
          處理新檔案
        </Button>

        {taskStatus?.status === 'failed' && (
          <Button
            variant="contained"
            color="warning"
            onClick={startProcessing}
            size="large"
          >
            重試處理
          </Button>
        )}
      </Box>

      {/* 使用提示 */}
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
          💡 處理完成後，系統會將所有切分後的檔案打包成 ZIP 格式供您下載。
          下載檔案會在 1 小時後自動刪除。
        </Typography>
      </Paper>
    </Box>
  );
};