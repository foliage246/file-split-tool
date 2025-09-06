# VPS Deployment Guide

This guide explains how to deploy the File Splitting Tool on a VPS server.

## Prerequisites

- VPS server with Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- Domain name pointed to your VPS IP address
- SSL certificates (Let's Encrypt recommended)

## Quick Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone Repository

```bash
git clone https://github.com/your-username/file-split-tool.git
cd file-split-tool
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.production.template .env.production

# Edit environment variables
nano .env.production
```

**Required Environment Variables:**

```env
# JWT Security (generate a strong random key)
JWT_SECRET_KEY=your-super-secret-jwt-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_monthly_price_id

# Domain
DOMAIN=yourdomain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### 4. SSL Certificates

#### Option A: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to project
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*.pem
```

#### Option B: Self-signed (Testing Only)

```bash
# Create SSL directory
mkdir -p ssl

# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=yourdomain.com"
```

### 5. Deploy

```bash
# Run deployment script
./deploy-prod.sh
```

## Manual Deployment Steps

If you prefer manual deployment:

```bash
# 1. Stop any existing containers
docker compose -f docker-compose.prod.yml down

# 2. Build images
docker compose -f docker-compose.prod.yml build --no-cache

# 3. Start services
docker compose -f docker-compose.prod.yml up -d

# 4. Check status
docker compose -f docker-compose.prod.yml ps
```

## Service Management

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f redis
```

### Restart Services

```bash
# Restart all services
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker compose -f docker-compose.prod.yml restart backend
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### Stop Services

```bash
docker compose -f docker-compose.prod.yml down
```

## Security Configuration

### Firewall Setup

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

### SSL Certificate Auto-Renewal

```bash
# Add to crontab
sudo crontab -e

# Add this line to renew certificates monthly
0 2 1 * * certbot renew --quiet && docker compose -f /path/to/your/project/docker-compose.prod.yml restart frontend
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check service health
curl -f https://yourdomain.com/health

# Check individual containers
docker compose -f docker-compose.prod.yml ps
```

### Backup Data

```bash
# Backup Redis data
docker compose -f docker-compose.prod.yml exec redis redis-cli --rdb /data/backup.rdb

# Copy backup from container
docker cp file_split_redis_prod:/data/backup.rdb ./redis-backup-$(date +%Y%m%d).rdb
```

### Performance Monitoring

```bash
# Monitor resource usage
docker stats

# Monitor logs in real-time
docker compose -f docker-compose.prod.yml logs -f --tail=100
```

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues**
   - Ensure certificates are in `ssl/` directory
   - Check certificate permissions
   - Verify domain DNS settings

2. **Environment Variables**
   - Verify all required variables are set in `.env.production`
   - Check for typos in variable names

3. **Port Conflicts**
   - Ensure ports 80 and 443 are not used by other services
   - Check firewall settings

4. **Docker Issues**
   - Restart Docker daemon: `sudo systemctl restart docker`
   - Clean up: `docker system prune -a`

### Log Analysis

```bash
# Backend API errors
docker compose -f docker-compose.prod.yml logs backend | grep ERROR

# Nginx access logs
docker compose -f docker-compose.prod.yml logs frontend | grep nginx

# Redis connection issues
docker compose -f docker-compose.prod.yml logs redis
```

## Performance Optimization

### System Resources

- **Minimum Requirements:**
  - 2 CPU cores
  - 2GB RAM
  - 20GB storage

- **Recommended:**
  - 4 CPU cores
  - 4GB RAM
  - 50GB SSD storage

### Database Optimization

Redis is configured with persistence enabled. Monitor memory usage:

```bash
docker compose -f docker-compose.prod.yml exec redis redis-cli info memory
```

## Support

For deployment issues:
1. Check logs for error messages
2. Verify environment configuration
3. Test SSL certificates
4. Check firewall and DNS settings

Contact: contact.floweasy@gmail.com