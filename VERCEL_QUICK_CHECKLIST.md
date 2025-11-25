# ✅ Vercel Deployment Quick Checklist

## Before You Start

- [ ] Have a PostgreSQL database ready (Supabase/Neon/Railway)
- [ ] Have a YouTube API key (optional)
- [ ] Code is pushed to GitHub

---

## Step 1: Database Setup (5 minutes)

- [ ] Sign up at https://supabase.com (or Neon/Railway)
- [ ] Create new project
- [ ] Copy database credentials:
  - [ ] Host
  - [ ] Port (5432)
  - [ ] Username
  - [ ] Password
  - [ ] Database name

---

## Step 2: Create Vercel Project (2 minutes)

- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New" → "Project"
- [ ] Import your GitHub repository
- [ ] **CRITICAL**: Set Root Directory to `backend`
- [ ] Framework Preset: "Other"

---

## Step 3: Environment Variables (10 minutes)

Add these in Vercel Dashboard → Settings → Environment Variables:

### Database (Required)
- [ ] `DB_TYPE=postgres`
- [ ] `DB_HOST=your-database-host`
- [ ] `DB_PORT=5432`
- [ ] `DB_USERNAME=postgres`
- [ ] `DB_PASSWORD=your-password`
- [ ] `DB_DATABASE=postgres`
- [ ] `DB_SSL=true`

### JWT (Required)
- [ ] `JWT_SECRET=generate-random-string`
- [ ] `JWT_EXPIRATION=7d`
- [ ] `JWT_REFRESH_SECRET=generate-different-random-string`
- [ ] `JWT_REFRESH_EXPIRATION=30d`

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Application (Required)
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`
- [ ] `API_PREFIX=api`

### YouTube (Optional)
- [ ] `YOUTUBE_API_KEY=your-key`
- [ ] `YOUTUBE_CHANNEL_ID=your-channel-id`
- [ ] `YOUTUBE_CACHE_TTL_MINUTES=10`

### Firebase (Optional)
- [ ] `FIREBASE_PROJECT_ID=...`
- [ ] `FIREBASE_PRIVATE_KEY=...`
- [ ] `FIREBASE_CLIENT_EMAIL=...`
- [ ] (and other Firebase vars)

**For each variable:**
- [ ] Check "Production"
- [ ] Check "Preview"
- [ ] Click "Save"

---

## Step 4: Deploy (2 minutes)

- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Check build logs for errors

---

## Step 5: Verify (2 minutes)

- [ ] Test: `https://your-project.vercel.app/api/health`
- [ ] Should return: `{"status":"ok",...}`
- [ ] Check Function Logs for errors
- [ ] Test registration endpoint

---

## Common Issues & Fixes

### Build Fails
- [ ] Root Directory = `backend`?
- [ ] All dependencies in package.json?
- [ ] Check build logs

### Function Crashes (500)
- [ ] Check Function Logs
- [ ] All environment variables set?
- [ ] Database credentials correct?
- [ ] Database allows external connections?

### 404 Not Found
- [ ] Root Directory = `backend`?
- [ ] `backend/api/index.ts` exists?
- [ ] `backend/vercel.json` exists?

---

## After Deployment

- [ ] Update Flutter app base URL
- [ ] Test all endpoints
- [ ] Monitor logs for errors

---

## Full Guide

See `VERCEL_DEPLOYMENT_STEP_BY_STEP.md` for detailed instructions.

---

**Total Time: ~20 minutes**

