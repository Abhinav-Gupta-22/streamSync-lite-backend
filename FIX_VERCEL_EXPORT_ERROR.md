# 🔧 Fix "Did you forget to export a function?" Error

## The Problem

Vercel error: **"Did you forget to export a function or a server?"**

This means Vercel can't find the exported serverless function.

---

## ✅ What I Fixed

1. **Updated `api/index.ts`** - Changed export format to be more explicit
2. **Simplified `vercel.json`** - Removed conflicting build config

---

## Step 1: Verify Vercel Project Settings

### 1.1 Check Root Directory

1. Go to https://vercel.com/dashboard
2. Click your project
3. **Settings** → **General**
4. **Root Directory** should be: `backend`
5. If not, set it and **Save**

### 1.2 Check Build Settings

1. **Settings** → **General**
2. **Build & Development Settings:**
   - **Framework Preset:** `Other`
   - **Build Command:** Leave empty (or `npm run build`)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

---

## Step 2: Verify Environment Variables

Make sure ALL are set (see `VERCEL_CRASH_FIX.md` for full list):

**Critical ones:**
- `DB_HOST` = `db.xafmqyqhfltddaosyczy.supabase.co`
- `DB_PORT` = `5432`
- `DB_USERNAME` = `postgres`
- `DB_PASSWORD` = (your password)
- `DB_DATABASE` = `postgres`
- `DB_SSL` = `true`
- `JWT_SECRET` = (random string)
- `JWT_REFRESH_SECRET` = (different random string)
- `NODE_ENV` = `production`

---

## Step 3: Commit and Push Changes

```bash
git add backend/api/index.ts backend/vercel.json
git commit -m "Fix: Update Vercel serverless function export"
git push origin main
```

---

## Step 4: Redeploy on Vercel

### Option A: Automatic (Recommended)

Vercel will auto-deploy when you push to GitHub. Wait 2-5 minutes.

### Option B: Manual

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. **Uncheck** "Use existing Build Cache"
5. Click **"Redeploy"**

---

## Step 5: Check Build Logs

1. Click on new deployment
2. **Build Logs** tab
3. Look for:
   - ✅ "Build Completed"
   - ✅ No TypeScript errors
   - ❌ Any errors (fix them)

---

## Step 6: Check Function Logs

1. **Deployments** → Latest deployment
2. **Functions** → `api/index` → **Logs**
3. Look for:
   - ✅ "🚀 API handler loading..."
   - ✅ "✅ Imports loaded successfully"
   - ✅ "✅ App initialized successfully"
   - ❌ Any errors

---

## Step 7: Test

Open in browser:
```
https://your-project-name.vercel.app/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","uptime":...}
```

---

## If Still Failing

### Check Function Logs for Specific Error

The logs will show:
- **Database connection errors** → Check DB_* variables
- **Import errors** → Check build completed
- **Initialization errors** → Check environment variables

### Common Issues

**Issue 1: Root Directory Wrong**
- Must be `backend` (not root of repo)

**Issue 2: Build Not Completing**
- Check Build Logs for errors
- Make sure `npm install` succeeds

**Issue 3: TypeScript Not Compiling**
- Vercel should auto-compile `api/` folder
- Check for TypeScript errors in Build Logs

**Issue 4: Missing Environment Variables**
- All `DB_*` variables must be set
- `JWT_SECRET` and `JWT_REFRESH_SECRET` must be set

---

## Quick Checklist

Before redeploying:

- [ ] Root Directory = `backend` ✅
- [ ] All environment variables set ✅
- [ ] Code pushed to GitHub ✅
- [ ] `api/index.ts` exists ✅
- [ ] `vercel.json` exists ✅

After redeploying:

- [ ] Build completed successfully ✅
- [ ] Function logs show initialization ✅
- [ ] Health endpoint works ✅

---

**After fixing, the function should export correctly and Vercel will find it!** 🎉

