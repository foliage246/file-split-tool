import os
import tempfile
import zipfile
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union
import pandas as pd
import chardet
from fastapi import UploadFile
import logging

logger = logging.getLogger(__name__)


class FileProcessor:
    """檔案處理引擎 - 支援 CSV（含Big5）、Excel、TXT 檔案的單欄位值切分"""
    
    SUPPORTED_EXTENSIONS = {'.csv', '.xlsx', '.xls', '.txt'}
    CSV_ENCODINGS = ['utf-8', 'big5', 'gb2312', 'gbk', 'latin-1', 'cp1252']
    
    def __init__(self):
        self.temp_dir = tempfile.mkdtemp()
    
    async def process_file(
        self, 
        file: UploadFile, 
        column_name: str,
        batch_size: Optional[int] = None
    ) -> Dict:
        """
        處理上傳的檔案，按指定欄位值進行切分
        
        Args:
            file: 上傳的檔案
            column_name: 要切分的欄位名稱
            batch_size: 每個批次的最大行數（可選）
            
        Returns:
            包含處理結果的字典
        """
        try:
            # 儲存上傳檔案
            file_path = await self._save_uploaded_file(file)
            
            # 檢查檔案類型
            file_extension = Path(file.filename).suffix.lower()
            if file_extension not in self.SUPPORTED_EXTENSIONS:
                raise ValueError(f"不支援的檔案類型: {file_extension}")
            
            # 讀取檔案內容
            df = await self._read_file(file_path, file_extension)
            
            # 驗證欄位是否存在
            if column_name not in df.columns:
                available_columns = list(df.columns)
                raise ValueError(f"欄位 '{column_name}' 不存在。可用欄位: {available_columns}")
            
            # 執行切分
            split_results = await self._split_by_column(df, column_name, batch_size)
            
            # 生成輸出檔案
            output_files = await self._generate_output_files(
                split_results, file_extension, file.filename
            )
            
            # 創建 ZIP 檔案
            zip_path = await self._create_zip_archive(output_files)
            
            return {
                "success": True,
                "total_rows": len(df),
                "split_groups": len(split_results),
                "output_files": len(output_files),
                "zip_path": zip_path,
                "file_details": [
                    {
                        "group_value": group,
                        "row_count": len(data),
                        "filename": f"{Path(file.filename).stem}_{group}{file_extension}"
                    }
                    for group, data in split_results.items()
                ]
            }
            
        except Exception as e:
            logger.error(f"檔案處理失敗: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _save_uploaded_file(self, file: UploadFile) -> str:
        """儲存上傳檔案到臨時目錄"""
        file_path = os.path.join(self.temp_dir, file.filename)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        return file_path
    
    async def _read_file(self, file_path: str, file_extension: str) -> pd.DataFrame:
        """根據檔案類型讀取檔案內容"""
        if file_extension == '.csv':
            return await self._read_csv_with_encoding(file_path)
        elif file_extension in ['.xlsx', '.xls']:
            return pd.read_excel(file_path)
        elif file_extension == '.txt':
            return await self._read_txt_file(file_path)
        else:
            raise ValueError(f"不支援的檔案類型: {file_extension}")
    
    async def _read_csv_with_encoding(self, file_path: str) -> pd.DataFrame:
        """支援多種編碼的 CSV 讀取，包含 Big5"""
        # 首先嘗試自動檢測編碼
        with open(file_path, 'rb') as f:
            raw_data = f.read()
            detected = chardet.detect(raw_data)
            detected_encoding = detected.get('encoding', 'utf-8')
        
        # 編碼優先順序：檢測到的編碼 + 常用編碼
        encodings_to_try = [detected_encoding] + [
            enc for enc in self.CSV_ENCODINGS if enc != detected_encoding
        ]
        
        for encoding in encodings_to_try:
            try:
                logger.info(f"嘗試使用編碼讀取 CSV: {encoding}")
                df = pd.read_csv(file_path, encoding=encoding)
                logger.info(f"成功使用 {encoding} 編碼讀取 CSV 檔案")
                return df
            except (UnicodeDecodeError, UnicodeError, pd.errors.ParserError) as e:
                logger.warning(f"使用 {encoding} 編碼讀取失敗: {str(e)}")
                continue
        
        raise ValueError(f"無法讀取 CSV 檔案，已嘗試編碼: {encodings_to_try}")
    
    async def _read_txt_file(self, file_path: str) -> pd.DataFrame:
        """讀取 TXT 檔案，嘗試自動檢測分隔符"""
        # 檢測編碼
        with open(file_path, 'rb') as f:
            raw_data = f.read()
            detected = chardet.detect(raw_data)
            encoding = detected.get('encoding', 'utf-8')
        
        # 嘗試不同的分隔符
        separators = ['\t', ',', ';', '|']
        
        for sep in separators:
            try:
                df = pd.read_csv(file_path, encoding=encoding, sep=sep)
                if len(df.columns) > 1:  # 如果成功分割成多欄
                    logger.info(f"TXT 檔案使用分隔符 '{sep}' 和編碼 '{encoding}' 讀取成功")
                    return df
            except Exception as e:
                continue
        
        # 如果都失敗，當作單欄位檔案處理
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                lines = [line.strip() for line in f.readlines() if line.strip()]
                df = pd.DataFrame({'content': lines})
                logger.info(f"TXT 檔案當作單欄位處理，編碼: {encoding}")
                return df
        except Exception as e:
            raise ValueError(f"無法讀取 TXT 檔案: {str(e)}")
    
    async def _split_by_column(
        self, 
        df: pd.DataFrame, 
        column_name: str, 
        batch_size: Optional[int] = None
    ) -> Dict[str, pd.DataFrame]:
        """按欄位值切分資料"""
        split_results = {}
        
        # 按欄位值分組
        grouped = df.groupby(column_name)
        
        for group_value, group_df in grouped:
            # 處理空值
            group_key = str(group_value) if pd.notna(group_value) else "空值"
            
            if batch_size and len(group_df) > batch_size:
                # 如果指定批次大小且資料超過限制，進一步切分
                for i, start_idx in enumerate(range(0, len(group_df), batch_size)):
                    end_idx = min(start_idx + batch_size, len(group_df))
                    batch_df = group_df.iloc[start_idx:end_idx].copy()
                    batch_key = f"{group_key}_batch_{i+1}"
                    split_results[batch_key] = batch_df
            else:
                split_results[group_key] = group_df.copy()
        
        logger.info(f"成功切分為 {len(split_results)} 個群組")
        return split_results
    
    async def _generate_output_files(
        self, 
        split_results: Dict[str, pd.DataFrame], 
        file_extension: str, 
        original_filename: str
    ) -> List[str]:
        """生成輸出檔案"""
        output_files = []
        base_name = Path(original_filename).stem
        
        for group_key, group_df in split_results.items():
            # 清理檔名中的特殊字符
            safe_group_key = self._sanitize_filename(group_key)
            output_filename = f"{base_name}_{safe_group_key}{file_extension}"
            output_path = os.path.join(self.temp_dir, output_filename)
            
            # 根據檔案類型儲存
            if file_extension == '.csv':
                group_df.to_csv(output_path, index=False, encoding='utf-8')
            elif file_extension in ['.xlsx', '.xls']:
                group_df.to_excel(output_path, index=False)
            elif file_extension == '.txt':
                # TXT 檔案特殊處理
                if 'content' in group_df.columns and len(group_df.columns) == 1:
                    # 單欄位內容直接寫入
                    with open(output_path, 'w', encoding='utf-8') as f:
                        for content in group_df['content']:
                            f.write(f"{content}\n")
                else:
                    # 多欄位用 tab 分隔
                    group_df.to_csv(output_path, index=False, sep='\t', encoding='utf-8')
            
            output_files.append(output_path)
            logger.info(f"生成輸出檔案: {output_filename} ({len(group_df)} 行)")
        
        return output_files
    
    async def _create_zip_archive(self, file_paths: List[str]) -> str:
        """創建包含所有輸出檔案的 ZIP 壓縮檔"""
        zip_path = os.path.join(self.temp_dir, "split_results.zip")
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in file_paths:
                file_name = os.path.basename(file_path)
                zipf.write(file_path, file_name)
                logger.info(f"加入 ZIP 檔案: {file_name}")
        
        logger.info(f"創建 ZIP 檔案成功: {zip_path}")
        return zip_path
    
    def _sanitize_filename(self, filename: str) -> str:
        """清理檔名中的非法字符"""
        import re
        # 移除或替換非法字符
        sanitized = re.sub(r'[^\w\-_\.]', '_', str(filename))
        # 限制長度
        return sanitized[:50] if len(sanitized) > 50 else sanitized
    
    def cleanup(self):
        """清理臨時檔案"""
        import shutil
        try:
            shutil.rmtree(self.temp_dir)
            logger.info(f"清理臨時目錄: {self.temp_dir}")
        except Exception as e:
            logger.error(f"清理臨時目錄失敗: {str(e)}")
    
    def get_file_info(self, file_path: str) -> Dict:
        """獲取檔案基本資訊"""
        file_stats = os.stat(file_path)
        return {
            "filename": os.path.basename(file_path),
            "size_bytes": file_stats.st_size,
            "size_mb": round(file_stats.st_size / (1024 * 1024), 2),
            "extension": Path(file_path).suffix.lower(),
            "supported": Path(file_path).suffix.lower() in self.SUPPORTED_EXTENSIONS
        }