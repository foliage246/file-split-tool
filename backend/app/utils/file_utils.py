import os
import mimetypes
from pathlib import Path
from typing import Optional, Tuple
import magic


def get_file_type(file_path: str) -> Tuple[str, str]:
    """
    獲取檔案類型和 MIME 類型
    
    Args:
        file_path: 檔案路徑
        
    Returns:
        (file_extension, mime_type)
    """
    extension = Path(file_path).suffix.lower()
    mime_type, _ = mimetypes.guess_type(file_path)
    
    # 如果 mimetypes 無法識別，嘗試使用 python-magic
    if not mime_type:
        try:
            mime_type = magic.from_file(file_path, mime=True)
        except:
            mime_type = "application/octet-stream"
    
    return extension, mime_type


def validate_file_size(file_path: str, max_size_mb: int) -> bool:
    """
    驗證檔案大小是否符合限制
    
    Args:
        file_path: 檔案路徑
        max_size_mb: 最大檔案大小（MB）
        
    Returns:
        是否符合大小限制
    """
    file_size = os.path.getsize(file_path)
    max_size_bytes = max_size_mb * 1024 * 1024
    return file_size <= max_size_bytes


def get_file_size_mb(file_path: str) -> float:
    """
    獲取檔案大小（MB）
    
    Args:
        file_path: 檔案路徑
        
    Returns:
        檔案大小（MB）
    """
    file_size_bytes = os.path.getsize(file_path)
    return round(file_size_bytes / (1024 * 1024), 2)


def is_supported_file_type(filename: str) -> bool:
    """
    檢查是否為支援的檔案類型
    
    Args:
        filename: 檔案名稱
        
    Returns:
        是否為支援的檔案類型
    """
    supported_extensions = {'.csv', '.xlsx', '.xls', '.txt'}
    extension = Path(filename).suffix.lower()
    return extension in supported_extensions


def sanitize_filename(filename: str) -> str:
    """
    清理檔名，移除非法字符
    
    Args:
        filename: 原始檔名
        
    Returns:
        清理後的檔名
    """
    import re
    
    # 保留檔案擴展名
    path = Path(filename)
    name = path.stem
    extension = path.suffix
    
    # 移除或替換非法字符
    clean_name = re.sub(r'[^\w\-_\.]', '_', name)
    
    # 移除連續的底線
    clean_name = re.sub(r'_{2,}', '_', clean_name)
    
    # 移除開頭和結尾的底線
    clean_name = clean_name.strip('_')
    
    # 限制長度
    if len(clean_name) > 100:
        clean_name = clean_name[:100]
    
    return f"{clean_name}{extension}"


def ensure_directory_exists(directory_path: str) -> None:
    """
    確保目錄存在，如果不存在則創建
    
    Args:
        directory_path: 目錄路徑
    """
    Path(directory_path).mkdir(parents=True, exist_ok=True)


def get_available_filename(file_path: str) -> str:
    """
    獲取可用的檔名，如果檔案已存在則加上數字後綴
    
    Args:
        file_path: 原始檔案路徑
        
    Returns:
        可用的檔案路徑
    """
    if not os.path.exists(file_path):
        return file_path
    
    path = Path(file_path)
    counter = 1
    
    while True:
        new_name = f"{path.stem}_{counter}{path.suffix}"
        new_path = path.parent / new_name
        
        if not new_path.exists():
            return str(new_path)
        
        counter += 1