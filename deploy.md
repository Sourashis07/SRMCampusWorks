# Deployment Guide

## Vercel Deployment Steps

### 1. Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Sourashis07/SRMCampusWorks.git
git push -u origin main
```

### 2. Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure project settings:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`

### 3. Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

**Production Variables:**
```
DATABASE_URL=your-production-postgresql-url
JWT_SECRET=your-jwt-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
FIREBASE_SERVICE_ACCOUNT_KEY=your-firebase-service-account-json
NODE_ENV=production
```

### 4. Database Setup
1. Create PostgreSQL database (Supabase/Neon/Railway)
2. Update DATABASE_URL in Vercel
3. Run migrations: `npx prisma db push`

### 5. Firebase Configuration
1. Create Firebase project
2. Enable Authentication
3. Add your Vercel domain to authorized domains
4. Update frontend environment variables

### 6. Update CORS Origins
After deployment, update `backend/server.js`:
```javascript
origin: ["https://your-actual-vercel-url.vercel.app"]
```

### 7. Deploy
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

## Post-Deployment Checklist
- [ ] Test user registration/login
- [ ] Test task creation
- [ ] Test bidding system
- [ ] Test file uploads
- [ ] Test payment flow
- [ ] Test real-time chat
- [ ] Verify all API endpoints
- [ ] Check mobile responsiveness

## Troubleshooting
- Check Vercel function logs for backend errors
- Verify environment variables are set correctly
- Ensure database connection is working
- Check CORS configuration
- Verify Firebase configuration