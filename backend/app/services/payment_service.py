import stripe
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import logging

from ..core.config import settings
from ..core.redis_client import get_redis_client
from ..models.user import User

logger = logging.getLogger(__name__)

# 配置 Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentService:
    """Stripe 付費服務"""
    
    def __init__(self):
        self.redis_client = None
    
    async def init_redis(self):
        """初始化 Redis 連接"""
        if not self.redis_client:
            self.redis_client = get_redis_client()
    
    async def create_customer(self, user: User) -> str:
        """
        創建 Stripe 客戶
        
        Args:
            user: 用戶物件
            
        Returns:
            Stripe 客戶 ID
        """
        try:
            customer = stripe.Customer.create(
                email=user.email,
                metadata={
                    "user_id": user.user_id,
                    "created_at": datetime.now().isoformat()
                }
            )
            
            logger.info(f"Created Stripe customer: {customer.id} for user: {user.user_id}")
            return customer.id
            
        except stripe.error.StripeError as e:
            logger.error(f"Failed to create Stripe customer: {str(e)}")
            raise Exception(f"創建付費客戶失敗: {str(e)}")
    
    async def create_subscription(
        self, 
        customer_id: str,
        price_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        創建訂閱
        
        Args:
            customer_id: Stripe 客戶 ID
            price_id: 價格 ID，如果未提供則使用預設價格
            
        Returns:
            訂閱資訊
        """
        try:
            if not price_id:
                price_id = settings.STRIPE_PRICE_ID
            
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{"price": price_id}],
                payment_behavior="default_incomplete",
                payment_settings={"save_default_payment_method": "on_subscription"},
                expand=["latest_invoice.payment_intent"]
            )
            
            logger.info(f"Created subscription: {subscription.id} for customer: {customer_id}")
            
            return {
                "subscription_id": subscription.id,
                "client_secret": subscription.latest_invoice.payment_intent.client_secret,
                "status": subscription.status
            }
            
        except stripe.error.StripeError as e:
            logger.error(f"Failed to create subscription: {str(e)}")
            raise Exception(f"創建訂閱失敗: {str(e)}")
    
    async def cancel_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """
        取消訂閱
        
        Args:
            subscription_id: 訂閱 ID
            
        Returns:
            取消結果
        """
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            canceled_subscription = stripe.Subscription.delete(subscription_id)
            
            logger.info(f"Canceled subscription: {subscription_id}")
            
            return {
                "subscription_id": canceled_subscription.id,
                "status": canceled_subscription.status,
                "canceled_at": canceled_subscription.canceled_at
            }
            
        except stripe.error.StripeError as e:
            logger.error(f"Failed to cancel subscription: {str(e)}")
            raise Exception(f"取消訂閱失敗: {str(e)}")
    
    async def get_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """
        獲取訂閱詳情
        
        Args:
            subscription_id: 訂閱 ID
            
        Returns:
            訂閱詳情
        """
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            
            return {
                "subscription_id": subscription.id,
                "customer_id": subscription.customer,
                "status": subscription.status,
                "current_period_start": subscription.current_period_start,
                "current_period_end": subscription.current_period_end,
                "cancel_at_period_end": subscription.cancel_at_period_end
            }
            
        except stripe.error.StripeError as e:
            logger.error(f"Failed to retrieve subscription: {str(e)}")
            raise Exception(f"獲取訂閱資訊失敗: {str(e)}")
    
    async def handle_webhook(self, payload: bytes, sig_header: str) -> Dict[str, Any]:
        """
        處理 Stripe Webhook
        
        Args:
            payload: Webhook 載荷
            sig_header: Stripe 簽名標頭
            
        Returns:
            處理結果
        """
        await self.init_redis()
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
            
            logger.info(f"Received Stripe webhook: {event['type']}")
            
            # 處理不同類型的事件
            if event["type"] == "invoice.payment_succeeded":
                await self._handle_payment_succeeded(event["data"]["object"])
            elif event["type"] == "invoice.payment_failed":
                await self._handle_payment_failed(event["data"]["object"])
            elif event["type"] == "customer.subscription.updated":
                await self._handle_subscription_updated(event["data"]["object"])
            elif event["type"] == "customer.subscription.deleted":
                await self._handle_subscription_deleted(event["data"]["object"])
            
            return {"status": "success", "event_type": event["type"]}
            
        except ValueError as e:
            logger.error(f"Invalid payload: {str(e)}")
            raise Exception("Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid signature: {str(e)}")
            raise Exception("Invalid signature")
        except Exception as e:
            logger.error(f"Webhook handling failed: {str(e)}")
            raise Exception(f"Webhook 處理失敗: {str(e)}")
    
    async def _handle_payment_succeeded(self, invoice: Dict[str, Any]):
        """處理付款成功事件"""
        customer_id = invoice["customer"]
        subscription_id = invoice["subscription"]
        
        # 獲取客戶資訊
        customer = stripe.Customer.retrieve(customer_id)
        user_id = customer.metadata.get("user_id")
        
        if user_id:
            # 更新用戶為付費用戶
            user_data = await self.redis_client.get(f"user:id:{user_id}")
            if user_data:
                user_dict = json.loads(user_data)
                user_dict["is_premium"] = True
                user_dict["stripe_customer_id"] = customer_id
                user_dict["stripe_subscription_id"] = subscription_id
                user_dict["subscription_start"] = datetime.now().isoformat()
                user_dict["updated_at"] = datetime.now().isoformat()
                
                await self.redis_client.set(
                    f"user:id:{user_id}",
                    json.dumps(user_dict, default=str)
                )
                
                logger.info(f"Updated user {user_id} to premium status")
    
    async def _handle_payment_failed(self, invoice: Dict[str, Any]):
        """處理付款失敗事件"""
        customer_id = invoice["customer"]
        
        # 獲取客戶資訊
        customer = stripe.Customer.retrieve(customer_id)
        user_id = customer.metadata.get("user_id")
        
        if user_id:
            logger.warning(f"Payment failed for user {user_id}")
            # 可以發送通知郵件或其他處理
    
    async def _handle_subscription_updated(self, subscription: Dict[str, Any]):
        """處理訂閱更新事件"""
        customer_id = subscription["customer"]
        subscription_id = subscription["id"]
        status = subscription["status"]
        
        # 獲取客戶資訊
        customer = stripe.Customer.retrieve(customer_id)
        user_id = customer.metadata.get("user_id")
        
        if user_id:
            user_data = await self.redis_client.get(f"user:id:{user_id}")
            if user_data:
                user_dict = json.loads(user_data)
                user_dict["stripe_subscription_id"] = subscription_id
                user_dict["subscription_status"] = status
                user_dict["updated_at"] = datetime.now().isoformat()
                
                # 根據訂閱狀態更新用戶權限
                if status in ["active", "trialing"]:
                    user_dict["is_premium"] = True
                elif status in ["canceled", "unpaid", "past_due"]:
                    user_dict["is_premium"] = False
                
                await self.redis_client.set(
                    f"user:id:{user_id}",
                    json.dumps(user_dict, default=str)
                )
                
                logger.info(f"Updated subscription status for user {user_id}: {status}")
    
    async def _handle_subscription_deleted(self, subscription: Dict[str, Any]):
        """處理訂閱刪除事件"""
        customer_id = subscription["customer"]
        
        # 獲取客戶資訊
        customer = stripe.Customer.retrieve(customer_id)
        user_id = customer.metadata.get("user_id")
        
        if user_id:
            user_data = await self.redis_client.get(f"user:id:{user_id}")
            if user_data:
                user_dict = json.loads(user_data)
                user_dict["is_premium"] = False
                user_dict["stripe_subscription_id"] = None
                user_dict["subscription_status"] = "canceled"
                user_dict["updated_at"] = datetime.now().isoformat()
                
                await self.redis_client.set(
                    f"user:id:{user_id}",
                    json.dumps(user_dict, default=str)
                )
                
                logger.info(f"Downgraded user {user_id} to free tier after subscription deletion")


# 單例模式
payment_service = PaymentService()