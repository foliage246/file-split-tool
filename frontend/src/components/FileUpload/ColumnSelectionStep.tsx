import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { ArrowBack, ArrowForward, Info } from '@mui/icons-material';
import { StepProps, FileUploadData } from '../../types';

interface ColumnSelectionStepProps extends StepProps {
  data: FileUploadData;
  onDataChange: (data: Partial<FileUploadData>) => void;
}

export const ColumnSelectionStep: React.FC<ColumnSelectionStepProps> = ({
  activeStep,
  onNext,
  onPrevious,
  data,
  onDataChange,
}) => {
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enableBatchSize, setEnableBatchSize] = useState(false);

  // 模擬從檔案讀取欄位名稱的功能
  useEffect(() => {
    if (data.file) {
      analyzeFile();
    }
  }, [data.file]);

  const analyzeFile = async () => {
    if (!data.file) return;

    setIsLoading(true);
    setError(null);

    try {
      // 這裡模擬檔案分析過程
      // 實際實現中，你可能需要使用 FileReader API 或發送到後端分析
      await new Promise(resolve => setTimeout(resolve, 1000));

      const fileName = data.file.name.toLowerCase();
      let columns: string[] = [];
      let preview: any[] = [];

      if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
        // CSV/TXT 檔案模擬欄位
        columns = ['姓名', '部門', '職位', '城市', '年齡', '薪資'];
        preview = [
          { '姓名': '張三', '部門': '銷售部', '職位': '經理', '城市': '台北', '年齡': 35, '薪資': 60000 },
          { '姓名': '李四', '部門': '技術部', '職位': '工程師', '城市': '新竹', '年齡': 28, '薪資': 55000 },
          { '姓名': '王五', '部門': '銷售部', '職位': '專員', '城市': '台中', '年齡': 25, '薪資': 40000 },
        ];
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // Excel 檔案模擬欄位
        columns = ['產品名稱', '類別', '價格', '庫存', '供應商', '地區'];
        preview = [
          { '產品名稱': '筆記型電腦', '類別': '電腦', '價格': 25000, '庫存': 50, '供應商': 'A公司', '地區': '北部' },
          { '產品名稱': '智慧手機', '類別': '手機', '價格': 15000, '庫存': 100, '供應商': 'B公司', '地區': '南部' },
          { '產品名稱': '平板電腦', '類別': '電腦', '價格': 12000, '庫存': 30, '供應商': 'A公司', '地區': '中部' },
        ];
      }

      setAvailableColumns(columns);
      setPreviewData(preview);
    } catch (err) {
      setError('檔案分析失敗，請檢查檔案格式是否正確');
    } finally {
      setIsLoading(false);
    }
  };

  const handleColumnChange = (event: SelectChangeEvent<string>) => {
    const columnName = event.target.value;
    onDataChange({ columnName });
    setError(null);
  };

  const handleBatchSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const batchSize = value ? parseInt(value) : undefined;
    onDataChange({ batchSize });
  };

  const handleNext = () => {
    if (!data.columnName) {
      setError('請選擇要切分的欄位');
      return;
    }

    if (enableBatchSize && data.batchSize && data.batchSize <= 0) {
      setError('批次大小必須大於 0');
      return;
    }

    onNext();
  };

  const getUniqueValues = (columnName: string): string[] => {
    if (!previewData.length) return [];
    
    const values = previewData
      .map(row => row[columnName])
      .filter((value, index, self) => self.indexOf(value) === index)
      .slice(0, 10); // 只顯示前10個不同的值
    
    return values;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        步驟 2: 選擇切分欄位
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            正在分析檔案結構...
          </Typography>
        </Box>
      ) : (
        <>
          {/* 檔案資訊 */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              檔案資訊
            </Typography>
            <Typography variant="body2" color="textSecondary">
              檔案名稱: {data.file?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              檔案大小: {data.file ? (data.file.size / (1024 * 1024)).toFixed(2) : 0} MB
            </Typography>
            <Typography variant="body2" color="textSecondary">
              檢測到 {availableColumns.length} 個欄位
            </Typography>
          </Paper>

          {/* 欄位選擇 */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              選擇切分欄位
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="column-select-label">請選擇要按其值進行切分的欄位</InputLabel>
              <Select
                labelId="column-select-label"
                value={data.columnName || ''}
                onChange={handleColumnChange}
                label="請選擇要按其值進行切分的欄位"
              >
                {availableColumns.map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 顯示所選欄位的預覽值 */}
            {data.columnName && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  該欄位的部分值預覽：
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {getUniqueValues(data.columnName).map((value, index) => (
                    <Chip
                      key={index}
                      label={String(value)}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  每個不同的值會生成一個獨立的檔案
                </Typography>
              </Box>
            )}
          </Paper>

          {/* 進階選項 */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              進階選項
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={enableBatchSize}
                  onChange={(e) => setEnableBatchSize(e.target.checked)}
                />
              }
              label="啟用批次大小限制（可選）"
              sx={{ mb: 2 }}
            />

            {enableBatchSize && (
              <TextField
                fullWidth
                label="每個檔案最大行數"
                type="number"
                value={data.batchSize || ''}
                onChange={handleBatchSizeChange}
                helperText="如果單個群組的資料超過此行數，會進一步切分為多個檔案"
                inputProps={{ min: 1, max: 10000 }}
                sx={{ mb: 2 }}
              />
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                💡 系統會根據您選擇的欄位值自動分組，每個不同的值會生成一個獨立檔案。
                {enableBatchSize && data.batchSize && 
                  ` 如果某組資料超過 ${data.batchSize} 行，會進一步分割。`
                }
              </Typography>
            </Alert>
          </Paper>

          {/* 資料預覽 */}
          {previewData.length > 0 && (
            <Paper sx={{ mb: 3 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  資料預覽 (前 3 行)
                </Typography>
              </Box>
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {availableColumns.map((column) => (
                        <TableCell 
                          key={column}
                          sx={{
                            fontWeight: 'bold',
                            bgcolor: column === data.columnName ? 'rgba(25, 118, 210, 0.1)' : 'inherit'
                          }}
                        >
                          {column}
                          {column === data.columnName && (
                            <Chip 
                              label="切分欄位" 
                              size="small" 
                              color="primary" 
                              sx={{ ml: 1, fontSize: '0.7rem', height: '20px' }}
                            />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        {availableColumns.map((column) => (
                          <TableCell 
                            key={column}
                            sx={{
                              bgcolor: column === data.columnName ? 'rgba(25, 118, 210, 0.05)' : 'inherit'
                            }}
                          >
                            {String(row[column] || '')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* 錯誤訊息 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* 導航按鈕 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onPrevious}
              size="large"
            >
              上一步
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleNext}
              disabled={!data.columnName}
              size="large"
            >
              開始處理
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};