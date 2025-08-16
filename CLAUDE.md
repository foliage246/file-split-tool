# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a desktop-optimized file splitting tool that processes files by splitting them based on single column values. Features a freemium model (free CSV-only, premium multi-format) with Stripe payment integration. Built with FastAPI backend, React frontend, and Redis caching.

**Key Features:**
- Free tier: CSV files only, 5 files/day, 10MB limit
- Premium tier: CSV + Excel + TXT, 50 files/day, 100MB limit  
- Desktop-first UI with professional Landing Page design
- Smart authentication flow with modal dialogs

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript, Vite bundler
- **UI Library**: Material-UI v7 with emotion styling
- **Routing**: React Router v7 
- **State Management**: React Context (SimpleAuthContext for auth)
- **Key Structure**:
  - `src/pages/`: Main page components (LandingPage, AppPage, LoginPage, etc.)
  - `src/components/`: Reusable components organized by feature
  - `src/context/`: Auth context management (use SimpleAuthContext, not AuthContext)
  - `src/services/`: API client and service integrations

### Backend (FastAPI + Python)
- **Framework**: FastAPI with uvicorn, Python 3.11+
- **File Processing**: pandas (CSV), openpyxl (Excel), built-in (TXT)
- **Caching**: Redis for sessions, usage tracking, and task management
- **Payment**: Stripe integration for subscription management
- **Key Structure**:
  - `app/api/endpoints/`: API route handlers (auth.py, files.py, payment.py)
  - `app/core/`: Configuration, security, dependencies
  - `app/services/`: Business logic (file_processor.py, payment_service.py)
  - `app/models/`: Data models (user.py, task.py)

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Caching**: Redis 7 with persistence
- **Web Server**: Nginx for frontend serving and API proxy
- **Storage**: Local volumes for file processing and Redis data

## Development Commands

### Local Development
```bash
# One-click deployment
./deploy.sh

# Development with Docker Compose
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart
docker-compose restart backend

# Stop services
docker-compose down
```

### Frontend Development
```bash
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint checking
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Run FastAPI development server (requires Redis)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Key Configuration

### Environment Variables (Required)
```bash
# Stripe Payment
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret  
STRIPE_PRICE_ID=price_your_monthly_price_id

# Security
JWT_SECRET_KEY=your-super-secret-jwt-key

# Usage Limits
FREE_DAILY_LIMIT=5
PREMIUM_DAILY_LIMIT=50
FREE_FILE_SIZE_LIMIT=10     # MB
PREMIUM_FILE_SIZE_LIMIT=100 # MB
```

### Service Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## Business Logic

### User Tiers
- **Free**: 5 files/day, 10MB limit, CSV only
- **Premium**: 50 files/day, 100MB limit, CSV + Excel + TXT
- Pricing: $9.99 USD/month

### File Processing Flow
1. **Upload**: User uploads file → validation → temporary storage
2. **Column Selection**: Display columns → user selects split column → preview
3. **Processing**: Split by column values → generate individual files → create ZIP → download link

### Payment Integration
- Stripe Checkout for subscriptions
- Webhook handling for real-time subscription updates
- Usage tracking with Redis counters
- Automatic access control based on subscription status

## Important Code Patterns

### Frontend Auth Context
Always use `SimpleAuthContext`, not `AuthContext`:
```typescript
import { useAuth } from '../context/SimpleAuthContext';
```

### API Routes Structure
- `/api/v1/auth/*` - Authentication (register, login, me)
- `/api/v1/files/*` - File operations (upload, status, download)  
- `/api/v1/payment/*` - Stripe integration (create-subscription, status, webhook)

### Route Structure
- `/` - Landing page (marketing, unauthenticated)
- `/app` - Main file processing tool (requires auth)
- `/login`, `/register` - Authentication pages
- `/pricing` - Pricing information

### File Processing
- Single column splitting only (not multi-column)
- Encoding auto-detection for CSV (UTF-8, Big5, GB2312)
- Automatic cleanup after 1 hour
- Task-based processing with Redis progress tracking

### Redis Data Patterns
- `session:{jwt_token}` - User session data
- `usage:{user_id}:{date}` - Daily usage tracking
- `task:{task_id}` - File processing tasks
- `file:{file_id}` - Uploaded file metadata

## Development Notes

### Frontend Specifics
- Uses Material-UI v7 with updated import patterns
- Desktop-optimized UI (not mobile-first)
- Price display format: "$9.99 USD/月" for premium, "免費" for free
- Landing page has auth modal for login/register prompts

### Backend Specifics  
- JWT tokens for authentication (24-hour expiry)
- Stripe webhook signature verification required
- File processing is synchronous (not queue-based)
- Automatic file cleanup using Redis TTL

### Docker & Deployment
- Multi-stage builds for frontend (Node → Nginx)
- Health checks for all services
- Volume persistence for Redis data and file storage
- Network isolation with custom bridge network

## Testing & Debugging

### Health Checks
```bash
# Redis connectivity
docker-compose exec redis redis-cli ping

# Backend API health
curl http://localhost:8000/health

# Frontend availability  
curl http://localhost:3000
```

### Common Issues
- **Frontend empty page**: Check SimpleAuthContext imports, not AuthContext
- **502 errors**: Verify backend health and Redis connectivity
- **File upload fails**: Check file size limits and supported formats
- **Payment issues**: Verify Stripe webhook endpoint and secrets

### Log Analysis
```bash
# View all service logs
docker-compose logs -f

# Backend processing logs
docker-compose logs backend | grep "file_processed"

# Stripe webhook logs
docker-compose logs backend | grep "stripe_webhook"
```