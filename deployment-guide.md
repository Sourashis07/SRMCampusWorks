# Deployment Guide

## Database Setup (Neon)

1. Go to https://neon.tech
2. Create free account
3. Create new project "srm-campus-works"
4. Copy connection string

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"
RAZORPAY_KEY_ID="your-key"
RAZORPAY_KEY_SECRET="your-secret"
JWT_SECRET="your-jwt-secret"
```

### Vercel Deployment

#### Frontend (Vercel)
1. Connect GitHub repo
2. Deploy frontend folder
3. Auto-deploys on push

#### Backend (Railway/Render)
1. Connect GitHub repo  
2. Add environment variables
3. Deploy backend folder

## Commands
```bash
# Deploy database schema
npx prisma db push

# Generate client
npx prisma generate
```