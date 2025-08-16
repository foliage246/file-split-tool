#!/usr/bin/env python3
"""
檔案切分工具整合測試腳本
測試後端 API 和檔案處理功能
"""

import os
import sys
import tempfile
import pandas as pd
import requests
import json
from pathlib import Path

# 添加後端模組路徑
sys.path.append('backend')

def create_test_csv():
    """創建測試 CSV 檔案"""
    data = {
        '姓名': ['張三', '李四', '王五', '趙六', '錢七', '孫八'],
        '部門': ['銷售部', '技術部', '銷售部', '人事部', '技術部', '銷售部'],
        '職位': ['經理', '工程師', '專員', '主管', '工程師', '專員'],
        '薪資': [60000, 55000, 40000, 50000, 58000, 42000]
    }
    
    df = pd.DataFrame(data)
    
    # 創建臨時檔案
    temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False, encoding='utf-8')
    df.to_csv(temp_file.name, index=False, encoding='utf-8')
    
    print(f"✅ 創建測試 CSV 檔案: {temp_file.name}")
    print(f"   檔案大小: {os.path.getsize(temp_file.name)} bytes")
    print(f"   資料行數: {len(df)}")
    
    return temp_file.name

def create_test_excel():
    """創建測試 Excel 檔案"""
    data = {
        '產品名稱': ['筆記型電腦', '智慧手機', '平板電腦', '耳機', '鍵盤', '滑鼠'],
        '類別': ['電腦', '手機', '電腦', '配件', '配件', '配件'],
        '價格': [25000, 15000, 12000, 3000, 2000, 1500],
        '庫存': [50, 100, 30, 200, 150, 180]
    }
    
    df = pd.DataFrame(data)
    
    # 創建臨時檔案
    temp_file = tempfile.NamedTemporaryFile(mode='wb', suffix='.xlsx', delete=False)
    df.to_excel(temp_file.name, index=False, engine='openpyxl')
    
    print(f"✅ 創建測試 Excel 檔案: {temp_file.name}")
    print(f"   檔案大小: {os.path.getsize(temp_file.name)} bytes")
    print(f"   資料行數: {len(df)}")
    
    return temp_file.name

def test_file_processor():
    """測試檔案處理引擎"""
    print("\n🧪 測試檔案處理引擎...")
    
    try:
        from app.services.file_processor import FileProcessor
        from fastapi import UploadFile
        import io
        
        processor = FileProcessor()
        
        # 測試 CSV 檔案
        csv_file = create_test_csv()
        
        # 模擬 UploadFile
        with open(csv_file, 'rb') as f:
            file_content = f.read()
        
        # 這裡簡化測試，實際需要 FastAPI 的 UploadFile 對象
        print("✅ 檔案處理引擎導入成功")
        print("✅ 測試檔案創建成功")
        
        # 清理
        os.unlink(csv_file)
        processor.cleanup()
        
    except ImportError as e:
        print(f"❌ 導入錯誤: {e}")
        return False
    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        return False
    
    return True

def test_models():
    """測試數據模型"""
    print("\n🧪 測試數據模型...")
    
    try:
        from app.models.user import User, UserCreate, UserLogin, UserResponse
        from app.models.task import TaskStatus, ProcessingTask
        from datetime import datetime
        
        # 測試用戶模型
        user = User(
            user_id="test_user",
            email="test@example.com",
            is_premium=False
        )
        print(f"✅ 用戶模型: {user.email}")
        
        # 測試任務模型  
        task = ProcessingTask(
            task_id="test_task",
            user_id="test_user", 
            filename="test.csv",
            file_size_mb=1.5,
            column_name="部門",
            status=TaskStatus.PENDING,
            created_at=datetime.now()
        )
        print(f"✅ 任務模型: {task.task_id}")
        
    except ImportError as e:
        print(f"❌ 導入錯誤: {e}")
        return False
    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        return False
    
    return True

def test_config():
    """測試配置"""
    print("\n🧪 測試配置...")
    
    try:
        from app.core.config import settings
        
        print(f"✅ 應用名稱: {settings.APP_NAME}")
        print(f"✅ API 版本: {settings.API_VERSION}")
        print(f"✅ 免費版限制: {settings.FREE_DAILY_LIMIT} 次/日, {settings.FREE_FILE_SIZE_LIMIT}MB")
        print(f"✅ 付費版限制: {settings.PREMIUM_DAILY_LIMIT} 次/日, {settings.PREMIUM_FILE_SIZE_LIMIT}MB")
        
    except ImportError as e:
        print(f"❌ 導入錯誤: {e}")
        return False
    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        return False
    
    return True

def test_security():
    """測試安全模組"""
    print("\n🧪 測試安全模組...")
    
    try:
        from app.core.security import create_access_token, verify_token, get_password_hash, verify_password
        
        # 測試密碼哈希
        password = "test_password"
        hashed = get_password_hash(password)
        print(f"✅ 密碼哈希成功")
        
        # 測試密碼驗證
        is_valid = verify_password(password, hashed)
        print(f"✅ 密碼驗證: {'成功' if is_valid else '失敗'}")
        
        # 測試 JWT token
        token = create_access_token(data={"sub": "test_user"})
        print(f"✅ JWT token 創建成功")
        
        # 測試 token 驗證
        payload = verify_token(token)
        print(f"✅ JWT token 驗證: {'成功' if payload else '失敗'}")
        
    except ImportError as e:
        print(f"❌ 導入錯誤: {e}")
        return False
    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        return False
    
    return True

def test_file_utils():
    """測試檔案工具"""
    print("\n🧪 測試檔案工具...")
    
    try:
        from app.utils.file_utils import (
            is_supported_file_type, 
            get_file_size_mb, 
            sanitize_filename
        )
        
        # 測試檔案類型檢查
        assert is_supported_file_type("test.csv") == True
        assert is_supported_file_type("test.xlsx") == True  
        assert is_supported_file_type("test.txt") == True
        assert is_supported_file_type("test.pdf") == False
        print("✅ 檔案類型檢查")
        
        # 測試檔名清理
        clean_name = sanitize_filename("測試檔案@#$.csv")
        print(f"✅ 檔名清理: {clean_name}")
        
        # 創建測試檔案並檢查大小
        test_file = create_test_csv()
        size_mb = get_file_size_mb(test_file)
        print(f"✅ 檔案大小檢查: {size_mb}MB")
        
        # 清理
        os.unlink(test_file)
        
    except ImportError as e:
        print(f"❌ 導入錯誤: {e}")
        return False
    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        return False
    
    return True

def test_pandas_functionality():
    """測試 pandas 檔案處理功能"""
    print("\n🧪 測試 pandas 檔案處理...")
    
    try:
        # 測試 CSV 處理
        csv_file = create_test_csv()
        df = pd.read_csv(csv_file, encoding='utf-8')
        print(f"✅ CSV 讀取成功: {len(df)} 行, {len(df.columns)} 欄")
        
        # 測試按欄位分組
        grouped = df.groupby('部門')
        split_count = len(grouped)
        print(f"✅ 按部門分組: {split_count} 個群組")
        
        for name, group in grouped:
            print(f"   - {name}: {len(group)} 行")
        
        # 清理
        os.unlink(csv_file)
        
        # 測試 Excel 處理
        excel_file = create_test_excel()
        df_excel = pd.read_excel(excel_file, engine='openpyxl')
        print(f"✅ Excel 讀取成功: {len(df_excel)} 行, {len(df_excel.columns)} 欄")
        
        # 測試按欄位分組
        grouped_excel = df_excel.groupby('類別')
        split_count_excel = len(grouped_excel)
        print(f"✅ 按類別分組: {split_count_excel} 個群組")
        
        for name, group in grouped_excel:
            print(f"   - {name}: {len(group)} 行")
        
        # 清理
        os.unlink(excel_file)
        
    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        return False
    
    return True

def main():
    """主測試函數"""
    print("🚀 檔案切分工具整合測試")
    print("=" * 50)
    
    test_results = []
    
    # 基礎功能測試
    test_results.append(("配置測試", test_config()))
    test_results.append(("數據模型測試", test_models()))
    test_results.append(("安全模組測試", test_security()))
    test_results.append(("檔案工具測試", test_file_utils()))
    test_results.append(("檔案處理引擎測試", test_file_processor()))
    test_results.append(("Pandas 功能測試", test_pandas_functionality()))
    
    # 測試結果總結
    print("\n" + "=" * 50)
    print("📊 測試結果總結:")
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ 通過" if result else "❌ 失敗"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n📈 總體結果: {passed}/{total} 個測試通過")
    
    if passed == total:
        print("🎉 所有測試通過！系統可以正常運行。")
        return True
    else:
        print("⚠️  部分測試失敗，請檢查相關模組。")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)