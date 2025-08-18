# SMTP郵件配置指南

本指南將幫助您配置SMTP郵件服務，以啟用找回密碼功能。

## 🎯 快速配置（推薦使用Gmail）

### 1. Gmail配置步驟

#### Step 1: 開啟Gmail兩步驟驗證
1. 前往 [Google帳戶設置](https://myaccount.google.com/)
2. 點擊「安全性」
3. 在「登入Google」部分，點擊「兩步驟驗證」
4. 按照指示完成設置

#### Step 2: 生成應用程式密碼
1. 在「安全性」頁面，點擊「應用程式密碼」
2. 選擇「應用程式」→「郵件」
3. 選擇「裝置」→「其他（自訂名稱）」
4. 輸入「File Split Tool」
5. 點擊「產生」
6. **重要：複製生成的16位應用程式密碼**

#### Step 3: 在Railway配置環境變數
1. 登入 [Railway Dashboard](https://railway.app/)
2. 選擇您的File Split Tool專案
3. 點擊後端服務（backend service）
4. 前往 **Settings** → **Environment Variables**
5. 添加以下變數：

```
SMTP_SERVER = smtp.gmail.com
SMTP_PORT = 587
SMTP_USERNAME = your-email@gmail.com
SMTP_PASSWORD = your-16-digit-app-password
FROM_EMAIL = your-email@gmail.com
FROM_NAME = File Split Tool
```

**注意：**
- `SMTP_USERNAME` 和 `FROM_EMAIL` 使用您的Gmail地址
- `SMTP_PASSWORD` 使用步驟2生成的16位應用程式密碼（不是您的Gmail密碼）

## 🔧 其他郵件服務提供商

### SendGrid（商業推薦）
適合生產環境，每月免費100封郵件

```
SMTP_SERVER = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_USERNAME = apikey
SMTP_PASSWORD = your-sendgrid-api-key
FROM_EMAIL = your-verified-email@yourdomain.com
FROM_NAME = File Split Tool
```

**設置步驟：**
1. 註冊 [SendGrid帳戶](https://sendgrid.com/)
2. 生成API Key
3. 驗證發件人郵箱

### Outlook/Hotmail
```
SMTP_SERVER = smtp-mail.outlook.com
SMTP_PORT = 587
SMTP_USERNAME = your-email@outlook.com
SMTP_PASSWORD = your-password
FROM_EMAIL = your-email@outlook.com
FROM_NAME = File Split Tool
```

### AWS SES
適合AWS環境

```
SMTP_SERVER = email-smtp.us-east-1.amazonaws.com
SMTP_PORT = 587
SMTP_USERNAME = your-ses-smtp-username
SMTP_PASSWORD = your-ses-smtp-password
FROM_EMAIL = your-verified-email@yourdomain.com
FROM_NAME = File Split Tool
```

## 🧪 測試配置

配置完成後，您可以：

1. **重新部署後端服務**
2. **前往找回密碼頁面**：`https://your-frontend-url/forgot-password`
3. **輸入註冊的郵箱地址**
4. **檢查郵箱是否收到重設郵件**

## 🔍 故障排除

### 郵件沒有收到？
1. **檢查垃圾郵件資料夾**
2. **確認SMTP環境變數拼寫正確**
3. **檢查Railway部署日誌**：
   - 成功：`INFO: Password reset email sent to user@example.com`
   - 失敗：`ERROR: Failed to send password reset email`

### Gmail特定問題
- ✅ 確保已開啟兩步驟驗證
- ✅ 使用應用程式密碼，不是Gmail密碼
- ✅ 檢查Gmail安全設置是否允許較不安全的應用程式

### Railway環境變數設置
```bash
# 在Railway Dashboard中設置：
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop  # 16位應用程式密碼
FROM_EMAIL=your-email@gmail.com
FROM_NAME=File Split Tool
```

## 🚀 本地開發

如果您在本地測試，可以創建 `.env` 文件：

```bash
# backend/.env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=File Split Tool
```

**注意：** 不要將 `.env` 文件提交到Git！

## 📋 檢查清單

- [ ] Gmail兩步驟驗證已開啟
- [ ] 已生成Gmail應用程式密碼
- [ ] Railway環境變數已正確設置
- [ ] 後端服務已重新部署
- [ ] 已測試找回密碼功能
- [ ] 郵件正常接收

配置完成後，您的用戶就可以使用找回密碼功能了！🎉