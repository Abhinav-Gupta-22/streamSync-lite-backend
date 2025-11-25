# 🚀 Complete Vercel Deployment Guide - Step by Step

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] GitHub account
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Code pushed to GitHub repository
- [ ] PostgreSQL database (free options: Supabase, Neon, Railway)

---

## Step 1: Set Up PostgreSQL Database (Required)

**⚠️ SQLite doesn't work on Vercel! You MUST use PostgreSQL.**

### Option A: Supabase (Recommended - Free)

1. Go to https://supabase.com
2. Sign up / Login
3. Click **"New Project"**
4. Fill in:
   - **Name**: streamsync-backend
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup
7. Go to **Project Settings** → **Database**
8. Copy these values (you'll need them):
   - **Host**: `db.xxxxx.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: (the one you created)
   - **Connection string**: Copy the URI

### Option B: Neon (Free - Serverless PostgreSQL)

1. Go to https://neon.tech
2. Sign up / Login
3. Click **"Create Project"**
4. Fill in project details
5. Copy connection details from dashboard

### Option C: Railway (Free $5 credit monthly)

1. Go to https://railway.app
2. Sign up / Login
3. Click **"New Project"** → **"Provision PostgreSQL"**
4. Copy connection details

---

## Step 2: Get YouTube API Key (Optional but Recommended)

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Enable **"YouTube Data API v3"**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key

---

## Step 3: Prepare Your Code

### 3.1 Verify Files Exist

Make sure these files exist in your repository:
```
backend/
├── api/
│   └── index.ts          ← Serverless function handler
├── vercel.json           ← Vercel configuration
├── package.json          ← Dependencies
├── tsconfig.json         ← TypeScript config
└── src/                  ← Your source code
```

### 3.2 Check vercel.json

Your `backend/vercel.json` should look like:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index"
    }
  ]
}
```

### 3.3 Commit and Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 4: Create Vercel Project

### 4.1 Import Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

### 4.2 Configure Project Settings

**⚠️ CRITICAL: Set Root Directory!**

1. In the **"Configure Project"** page:
   - **Framework Preset**: Select **"Other"**
   - **Root Directory**: Click **"Edit"** → Set to `backend`
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install` (or `yarn install`)

2. **DO NOT CLICK DEPLOY YET!** We need to set environment variables first.

---

## Step 5: Set Environment Variables

### 5.1 Go to Environment Variables

1. In the Vercel project setup page, scroll down to **"Environment Variables"**
2. Or go to **Project Settings** → **Environment Variables**

### 5.2 Add All Required Variables

Add each variable one by one:

#### Database Variables (Required)
```
DB_TYPE=postgres
DB_HOST=db.xxxxx.supabase.co          (from Step 1)
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here        (from Step 1)
DB_DATABASE=postgres
DB_SSL=true
```

#### JWT Variables (Required)
```
JWT_SECRET=your-random-secret-key-here-make-it-long-and-secure
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=another-random-secret-key-here-different-from-jwt-secret
JWT_REFRESH_EXPIRATION=30d
```

**Generate secrets:**
```bash
# Use this command to generate random secrets:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Application Variables
```
NODE_ENV=production
PORT=3000
API_PREFIX=api
```

#### YouTube API (Optional but Recommended)
```
YOUTUBE_API_KEY=your_youtube_api_key_here        (from Step 2)
YOUTUBE_CHANNEL_ID=UC80PWRj_ZU8Zu0HSMNVwKWw      (or your channel ID)
YOUTUBE_CACHE_TTL_MINUTES=10
```

#### Firebase (Optional - for push notifications)
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

**Important for Firebase:**
- Copy the private key EXACTLY as shown (with `\n` for newlines)
- Or use the full key with actual newlines

### 5.3 Set for All Environments

For each variable:
- Check **"Production"**
- Check **"Preview"**
- Check **"Development"** (optional)

### 5.4 Save All Variables

Click **"Save"** after adding each variable.

---

## Step 6: Deploy

### 6.1 Initial Deployment

1. After setting all environment variables, click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Watch the build logs for any errors

### 6.2 Check Build Logs

1. Click on the deployment
2. Check **"Build Logs"** tab
3. Look for:
   - ✅ "Build Completed"
   - ❌ Any errors (fix them before proceeding)

---

## Step 7: Verify Deployment

### 7.1 Test Health Endpoint

Open in browser:
```
https://your-project-name.vercel.app/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","uptime":...}
```

### 7.2 Test Other Endpoints

```
https://your-project-name.vercel.app/api/auth/register
```

Should return validation error (which means it's working).

### 7.3 Check Function Logs

1. Go to **Deployments** → Latest deployment
2. Click **"Functions"** tab
3. Click on `api/index`
4. Check **"Logs"** tab for any runtime errors

---

## Step 8: Troubleshooting

### Issue: Build Fails

**Check:**
- Root Directory is set to `backend`
- All dependencies are in `package.json`
- TypeScript compiles locally: `npm run build`

**Fix:**
- Check build logs for specific error
- Fix the error
- Commit and push
- Redeploy

### Issue: Function Crashes (500 Error)

**Check Function Logs:**
1. Go to Deployments → Functions → api/index → Logs
2. Look for error messages

**Common Errors:**

**"Missing required database configuration"**
- Check all DB_* environment variables are set
- Verify database credentials are correct
- Test database connection from your computer

**"Cannot connect to database"**
- Check database allows external connections
- Verify DB_HOST is correct
- Check DB_SSL=true for cloud databases
- Verify firewall allows connections

**"JWT_SECRET is required"**
- Check JWT_SECRET and JWT_REFRESH_SECRET are set
- Make sure they're different values

**"TypeORM connection timeout"**
- Database might be sleeping (free tier)
- Try connecting to wake it up
- Check database is running

### Issue: 404 Not Found

**Check:**
- Root Directory is set to `backend`
- `backend/api/index.ts` exists
- `backend/vercel.json` exists
- Routes are correct

**Fix:**
- Verify Root Directory in Project Settings
- Redeploy

### Issue: CORS Errors

**Already configured in code**, but if you see CORS errors:
- Check CORS settings in `api/index.ts`
- Verify origin is set correctly

---

## Step 9: Update Flutter App

After successful deployment, update your Flutter app:

1. Open `frontend/lib/core/constants/api_constants.dart`
2. Update base URL:
```dart
static String get baseUrl {
  return 'https://your-project-name.vercel.app/api';
}
```

3. Hot restart your Flutter app

---

## Step 10: Monitor and Maintain

### Check Logs Regularly

1. Go to Vercel Dashboard → Your Project
2. Click **"Logs"** tab
3. Monitor for errors

### Update Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Update values as needed
3. **Redeploy** after changes

### Database Migrations

If you need to run migrations:
1. Use TypeORM migrations locally
2. Or use database management tool
3. Or add migration script to Vercel

---

## Quick Checklist

Before deploying, verify:

- [ ] PostgreSQL database is set up and accessible
- [ ] All environment variables are set in Vercel
- [ ] Root Directory is set to `backend`
- [ ] Code is pushed to GitHub
- [ ] `backend/api/index.ts` exists
- [ ] `backend/vercel.json` exists
- [ ] Build completes successfully
- [ ] Health endpoint works
- [ ] Function logs show no errors

---

## Common Mistakes to Avoid

1. ❌ **Forgetting to set Root Directory** → 404 errors
2. ❌ **Using SQLite** → Won't work on Vercel
3. ❌ **Missing environment variables** → Function crashes
4. ❌ **Wrong database credentials** → Connection fails
5. ❌ **Not redeploying after env var changes** → Old values used
6. ❌ **Firebase private key format wrong** → Auth fails

---

## Need Help?

1. **Check Vercel Logs**: Most issues show up in logs
2. **Test Locally First**: Make sure it works locally with same env vars
3. **Check Database**: Verify database is accessible
4. **Review Error Messages**: They usually tell you what's wrong

---

## Success Indicators

✅ Build completes without errors
✅ Health endpoint returns `{"status":"ok"}`
✅ Function logs show successful requests
✅ No 500 errors in logs
✅ Can register/login users
✅ Can fetch videos

---

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure rate limiting
3. Set up monitoring/alerts
4. Enable Vercel Analytics
5. Set up CI/CD for auto-deployment

---

**Good luck with your deployment! 🚀**

