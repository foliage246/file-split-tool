import os
import secrets
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from typing import Optional
import logging
from smtplib import SMTPException, SMTPAuthenticationError, SMTPConnectError, SMTPServerDisconnected

logger = logging.getLogger(__name__)

class EmailService:
    """郵件發送服務"""
    
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_username)
        self.from_name = os.getenv("FROM_NAME", "File Split Tool")
        
        # Log configuration (without sensitive data)
        logger.info(f"Email service initialized:")
        logger.info(f"  SMTP Server: {self.smtp_server}:{self.smtp_port}")
        logger.info(f"  From Email: {self.from_email}")
        logger.info(f"  From Name: {self.from_name}")
        logger.info(f"  Username configured: {'Yes' if self.smtp_username else 'No'}")
        logger.info(f"  Password configured: {'Yes' if self.smtp_password else 'No'}")
        
        # Validate configuration
        if not self.smtp_username or not self.smtp_password:
            logger.warning("SMTP credentials not configured - emails will only be logged in development mode")
        
    async def send_password_reset_email(self, to_email: str, reset_token: str, frontend_url: str = "https://file-split-tool-production.up.railway.app") -> bool:
        """
        發送密碼重設郵件
        
        Args:
            to_email: 收件人郵件地址
            reset_token: 重設密碼token
            frontend_url: 前端URL
            
        Returns:
            發送成功返回True，失敗返回False
        """
        try:
            # 構建重設連結
            reset_url = f"{frontend_url}/reset-password?token={reset_token}"
            
            # 郵件模板
            html_template = Template("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Password Reset - File Split Tool</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { font-size: 24px; font-weight: bold; color: #1976d2; margin-bottom: 10px; }
                    .title { font-size: 20px; color: #333; margin-bottom: 20px; }
                    .content { line-height: 1.6; color: #555; margin-bottom: 30px; }
                    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
                    .button:hover { opacity: 0.9; }
                    .footer { margin-top: 30px; font-size: 12px; color: #999; text-align: center; }
                    .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">File Split Tool</div>
                        <div class="title">Password Reset Request</div>
                    </div>
                    
                    <div class="content">
                        <p>Hello,</p>
                        <p>We received a request to reset your password for your File Split Tool account associated with <strong>{{ email }}</strong>.</p>
                        <p>Click the button below to reset your password:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{{ reset_url }}" class="button">Reset Password</a>
                        </div>
                        
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">{{ reset_url }}</p>
                        
                        <div class="warning">
                            <strong>Security Notice:</strong>
                            <ul>
                                <li>This link will expire in 1 hour for security reasons</li>
                                <li>If you didn't request this password reset, please ignore this email</li>
                                <li>Never share this link with anyone</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>This email was sent by File Split Tool. If you have any questions, please contact our support team.</p>
                        <p>&copy; 2024 File Split Tool. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """)
            
            # 純文字版本
            text_content = f"""
            Password Reset Request - File Split Tool
            
            Hello,
            
            We received a request to reset your password for your File Split Tool account associated with {to_email}.
            
            Click the link below to reset your password:
            {reset_url}
            
            Security Notice:
            - This link will expire in 1 hour for security reasons
            - If you didn't request this password reset, please ignore this email
            - Never share this link with anyone
            
            This email was sent by File Split Tool.
            © 2024 File Split Tool. All rights reserved.
            """
            
            # 渲染HTML模板
            html_content = html_template.render(
                email=to_email,
                reset_url=reset_url
            )
            
            # 創建郵件
            msg = MIMEMultipart("alternative")
            msg["Subject"] = "Password Reset - File Split Tool"
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = to_email
            
            # 添加文字和HTML部分
            text_part = MIMEText(text_content, "plain")
            html_part = MIMEText(html_content, "html")
            
            msg.attach(text_part)
            msg.attach(html_part)
            
            # 發送郵件
            if self.smtp_username and self.smtp_password:
                try:
                    logger.info(f"Attempting to send email to {to_email} via {self.smtp_server}:{self.smtp_port}")
                    await aiosmtplib.send(
                        msg,
                        hostname=self.smtp_server,
                        port=self.smtp_port,
                        start_tls=True,
                        username=self.smtp_username,
                        password=self.smtp_password,
                    )
                    logger.info(f"✅ Password reset email successfully sent to {to_email}")
                    return True
                except SMTPAuthenticationError as e:
                    logger.error(f"❌ SMTP Authentication failed: {str(e)}")
                    logger.error("Check SMTP_USERNAME and SMTP_PASSWORD environment variables")
                    return False
                except SMTPConnectError as e:
                    logger.error(f"❌ SMTP Connection failed: {str(e)}")
                    logger.error(f"Cannot connect to {self.smtp_server}:{self.smtp_port}")
                    return False
                except SMTPServerDisconnected as e:
                    logger.error(f"❌ SMTP Server disconnected: {str(e)}")
                    return False
                except SMTPException as e:
                    logger.error(f"❌ SMTP Error: {str(e)}")
                    return False
                except Exception as e:
                    logger.error(f"❌ Unexpected error sending email: {str(e)}")
                    return False
            else:
                # 開發環境下，只記錄日誌而不實際發送
                logger.warning(f"[DEV MODE] SMTP credentials not configured")
                logger.info(f"[DEV MODE] Password reset email would be sent to {to_email}")
                logger.info(f"[DEV MODE] Reset URL: {reset_url}")
                return True
                
        except Exception as e:
            logger.error(f"❌ Failed to prepare password reset email for {to_email}: {str(e)}")
            return False

def generate_reset_token() -> str:
    """生成重設密碼token"""
    return secrets.token_urlsafe(32)

# 單例實例
email_service = EmailService()