#!/bin/bash

# Production Deployment Script for File Splitting Tool
set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production file not found!${NC}"
    echo -e "${YELLOW}📋 Please copy .env.production.template to .env.production and configure your settings${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Loading environment variables...${NC}"
export $(grep -v '^#' .env.production | xargs)

# Check required environment variables
REQUIRED_VARS=("JWT_SECRET_KEY" "STRIPE_SECRET_KEY" "STRIPE_WEBHOOK_SECRET" "STRIPE_PRICE_ID")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Required environment variable $var is not set!${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Environment variables validated${NC}"

# Create SSL directory if it doesn't exist
echo -e "${BLUE}🔐 Setting up SSL directory...${NC}"
mkdir -p ssl

# Check if SSL certificates exist
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    echo -e "${YELLOW}⚠️  SSL certificates not found in ssl/ directory${NC}"
    echo -e "${YELLOW}📝 Please add your SSL certificates:${NC}"
    echo -e "   - ssl/cert.pem (certificate file)"
    echo -e "   - ssl/key.pem (private key file)"
    echo -e "${YELLOW}💡 For Let's Encrypt, you can use certbot:${NC}"
    echo -e "   sudo certbot certonly --standalone -d yourdomain.com"
    echo -e "   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem"
    echo -e "   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem"
    
    # Create self-signed certificates for testing (not for production!)
    read -p "Generate self-signed certificates for testing? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🔧 Generating self-signed certificates (NOT for production!)...${NC}"
        openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=${DOMAIN:-localhost}"
        echo -e "${GREEN}✅ Self-signed certificates created${NC}"
    else
        exit 1
    fi
fi

echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down

echo -e "${BLUE}🏗️  Building production images...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

echo -e "${BLUE}🚀 Starting production services...${NC}"
docker compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check service health
echo -e "${BLUE}🔍 Checking service health...${NC}"

# Check Redis
if docker compose -f docker-compose.prod.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is healthy${NC}"
else
    echo -e "${RED}❌ Redis health check failed${NC}"
fi

# Check Backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
fi

# Check Frontend
if curl -f -k https://localhost > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
fi

echo -e "${GREEN}🎉 Production deployment completed!${NC}"
echo
echo -e "${BLUE}📊 Service Status:${NC}"
docker compose -f docker-compose.prod.yml ps
echo
echo -e "${BLUE}🌐 Access your application:${NC}"
echo -e "   HTTPS: https://${DOMAIN:-localhost}"
echo -e "   HTTP (redirects to HTTPS): http://${DOMAIN:-localhost}"
echo -e "   API Health: https://${DOMAIN:-localhost}/health"
echo
echo -e "${BLUE}📝 To view logs:${NC}"
echo -e "   docker compose -f docker-compose.prod.yml logs -f"
echo
echo -e "${BLUE}🛑 To stop services:${NC}"
echo -e "   docker compose -f docker-compose.prod.yml down"