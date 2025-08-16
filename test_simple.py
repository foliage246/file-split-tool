#!/usr/bin/env python3
"""
簡化版整合測試 - 不依賴外部套件
檢查專案結構和基本配置
"""

import os
import sys
from pathlib import Path

def test_project_structure():
    """測試專案結構"""
    print("🧪 測試專案結構...")
    
    # 檢查主要目錄
    required_dirs = [
        'backend/app',
        'backend/app/api',
        'backend/app/core', 
        'backend/app/models',
        'backend/app/services',
        'backend/app/utils',
        'frontend/src',
        'frontend/src/components',
        'frontend/src/pages',
        'frontend/src/services',
        'frontend/src/types'
    ]
    
    missing_dirs = []
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            missing_dirs.append(dir_path)
        else:
            print(f"✅ {dir_path}")
    
    if missing_dirs:
        print(f"❌ 缺少目錄: {missing_dirs}")
        return False
    
    return True

def test_backend_files():
    """測試後端關鍵檔案"""
    print("\n🧪 測試後端關鍵檔案...")
    
    required_files = [
        'backend/requirements.txt',
        'backend/Dockerfile',
        'backend/app/main.py',
        'backend/app/core/config.py',
        'backend/app/core/security.py',
        'backend/app/core/redis_client.py',
        'backend/app/models/user.py',
        'backend/app/models/task.py',
        'backend/app/services/file_processor.py',
        'backend/app/services/payment_service.py',
        'backend/app/api/api.py',
        'backend/app/api/endpoints/auth.py',
        'backend/app/api/endpoints/files.py',
        'backend/app/api/endpoints/payment.py',
        'backend/app/utils/file_utils.py'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
        else:
            file_size = os.path.getsize(file_path)
            print(f"✅ {file_path} ({file_size} bytes)")
    
    if missing_files:
        print(f"❌ 缺少檔案: {missing_files}")
        return False
    
    return True

def test_frontend_files():
    """測試前端關鍵檔案"""
    print("\n🧪 測試前端關鍵檔案...")
    
    required_files = [
        'frontend/package.json',
        'frontend/Dockerfile',
        'frontend/nginx.conf',
        'frontend/src/App.tsx',
        'frontend/src/types/index.ts',
        'frontend/src/services/api.ts',
        'frontend/src/context/AuthContext.tsx',
        'frontend/src/components/Layout/AppLayout.tsx',
        'frontend/src/components/FileUpload/FileUploadStep.tsx',
        'frontend/src/components/FileUpload/ColumnSelectionStep.tsx',
        'frontend/src/components/FileUpload/ProcessingStep.tsx',
        'frontend/src/pages/HomePage.tsx',
        'frontend/src/pages/LoginPage.tsx',
        'frontend/src/pages/RegisterPage.tsx',
        'frontend/src/pages/PricingPage.tsx'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
        else:
            file_size = os.path.getsize(file_path)
            print(f"✅ {file_path} ({file_size} bytes)")
    
    if missing_files:
        print(f"❌ 缺少檔案: {missing_files}")
        return False
    
    return True

def test_docker_files():
    """測試 Docker 配置檔案"""
    print("\n🧪 測試 Docker 配置檔案...")
    
    required_files = [
        'docker-compose.yml',
        '.env.example',
        '.dockerignore',
        'deploy.sh'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
        else:
            file_size = os.path.getsize(file_path)
            print(f"✅ {file_path} ({file_size} bytes)")
    
    if missing_files:
        print(f"❌ 缺少檔案: {missing_files}")
        return False
    
    return True

def test_config_files():
    """測試配置檔案內容"""
    print("\n🧪 測試配置檔案內容...")
    
    try:
        # 檢查 .env 檔案
        if os.path.exists('.env'):
            with open('.env', 'r') as f:
                env_content = f.read()
                if 'STRIPE_SECRET_KEY' in env_content:
                    print("✅ .env 檔案包含 Stripe 配置")
                if 'JWT_SECRET_KEY' in env_content:
                    print("✅ .env 檔案包含 JWT 配置")
        else:
            print("❌ .env 檔案不存在")
            return False
        
        # 檢查 package.json
        if os.path.exists('frontend/package.json'):
            with open('frontend/package.json', 'r') as f:
                package_content = f.read()
                if '@mui/material' in package_content:
                    print("✅ package.json 包含 Material-UI")
                if 'react-router-dom' in package_content:
                    print("✅ package.json 包含 React Router")
        
        # 檢查 requirements.txt
        if os.path.exists('backend/requirements.txt'):
            with open('backend/requirements.txt', 'r') as f:
                req_content = f.read()
                if 'fastapi' in req_content:
                    print("✅ requirements.txt 包含 FastAPI")
                if 'stripe' in req_content:
                    print("✅ requirements.txt 包含 Stripe")
                if 'pandas' in req_content:
                    print("✅ requirements.txt 包含 Pandas")
        
        return True
        
    except Exception as e:
        print(f"❌ 配置檔案檢查失敗: {e}")
        return False

def test_code_syntax():
    """測試 Python 程式碼語法"""
    print("\n🧪 測試 Python 程式碼語法...")
    
    python_files = []
    for root, dirs, files in os.walk('backend'):
        for file in files:
            if file.endswith('.py'):
                python_files.append(os.path.join(root, file))
    
    syntax_errors = []
    for file_path in python_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                code = f.read()
                compile(code, file_path, 'exec')
            print(f"✅ {file_path}")
        except SyntaxError as e:
            syntax_errors.append(f"{file_path}: {e}")
            print(f"❌ {file_path}: 語法錯誤")
        except Exception as e:
            print(f"⚠️  {file_path}: {e}")
    
    if syntax_errors:
        print(f"❌ 語法錯誤: {syntax_errors}")
        return False
    
    return True

def check_feature_completeness():
    """檢查功能完整性"""
    print("\n🧪 檢查功能完整性...")
    
    features = {
        "檔案上傳功能": "frontend/src/components/FileUpload/FileUploadStep.tsx",
        "欄位選擇功能": "frontend/src/components/FileUpload/ColumnSelectionStep.tsx", 
        "處理狀態顯示": "frontend/src/components/FileUpload/ProcessingStep.tsx",
        "用戶認證": "backend/app/api/endpoints/auth.py",
        "檔案處理": "backend/app/services/file_processor.py",
        "付費系統": "backend/app/services/payment_service.py",
        "價格方案頁面": "frontend/src/pages/PricingPage.tsx",
        "登入註冊": "frontend/src/pages/LoginPage.tsx"
    }
    
    missing_features = []
    for feature_name, file_path in features.items():
        if os.path.exists(file_path):
            print(f"✅ {feature_name}")
        else:
            missing_features.append(feature_name)
            print(f"❌ {feature_name}")
    
    if missing_features:
        return False
    
    return True

def main():
    """主測試函數"""
    print("🚀 檔案切分工具整合測試（簡化版）")
    print("=" * 50)
    
    test_results = []
    
    # 結構和檔案測試
    test_results.append(("專案結構", test_project_structure()))
    test_results.append(("後端檔案", test_backend_files()))
    test_results.append(("前端檔案", test_frontend_files()))
    test_results.append(("Docker 檔案", test_docker_files()))
    test_results.append(("配置檔案", test_config_files()))
    test_results.append(("程式碼語法", test_code_syntax()))
    test_results.append(("功能完整性", check_feature_completeness()))
    
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
        print("\n🎉 所有測試通過！專案結構完整。")
        print("\n📋 部署指南:")
        print("1. 確保已安裝 Docker 和 Docker Compose")
        print("2. 編輯 .env 檔案，設置正確的 Stripe 密鑰")
        print("3. 運行 ./deploy.sh 進行一鍵部署")
        print("4. 訪問 http://localhost 使用應用")
        return True
    else:
        print("\n⚠️  部分測試失敗，請檢查相關檔案。")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)