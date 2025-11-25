# 🔄 Redeploy Backend to Vercel - After Fixing Server Crash

## ✅ What We Fixed

- Database synchronize is now **DISABLED by default** (prevents crashes)
- Backend starts successfully locally
- Ready to redeploy!

---

## Step 1: Commit and Push Changes (2 minutes)

### 1.1 Check What Changed

```bash
git status
```

You should see changes in:
- `backend/src/config/typeorm.config.ts` (synchronize fix)
- `backend/src/config/configuration.ts` (DB_SYNC support)
- `backend/.env` (DB_SYNC=false)

### 1.2 Commit Changes

```bash
# From project root
git add backend/src/config/typeorm.config.ts
git add backend/src/config/configuration.ts
# Don't commit .env (it's in .gitignore)

git commit -m "Fix: Disable database synchronize by default to prevent crashes"
```

### 1.3 Push to GitHub

```bash
git push origin main
```

---

## Step 2: Update Vercel Environment Variables (Important!)

### 2.1 Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Click on your project (e.g., `stream-sync-lite-backend`)
3. Go to **Settings** → **Environment Variables**

### 2.2 Check/Update DB_SYNC

**Option A: Remove DB_SYNC (Recommended)**
- If `DB_SYNC` exists, **delete it** or set it to `false`
- This ensures synchronize is disabled (safer)

**Option B: Set DB_SYNC=false**
- Add/Update: `DB_SYNC` = `false`
- Environments: ✅ Production ✅ Preview ✅ Development

**⚠️ Important:** Do NOT set `DB_SYNC=true` on Vercel! This will cause crashes.

### 2.3 Verify Other Environment Variables

Make sure these are still set:
- ✅ `DB_HOST` (your Supabase host)
- ✅ `DB_USERNAME` (postgres)
- ✅ `DB_PASSWORD` (your password)
- ✅ `DB_DATABASE` (postgres)
- ✅ `DB_SSL` (true)
- ✅ `JWT_SECRET`
- ✅ `JWT_REFRESH_SECRET`
- ✅ `NODE_ENV` (production)

---

## Step 3: Trigger New Deployment (2 minutes)

### Option A: Automatic (Recommended)

Vercel will **automatically deploy** when you push to GitHub!

1. After `git push`, go to Vercel dashboard
2. You'll see a new deployment starting
3. Wait 2-5 minutes for it to complete

### Option B: Manual Trigger

1. Go to **Deployments** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Confirm

---

## Step 4: Verify Deployment (2 minutes)

### 4.1 Check Build Logs

1. Click on the new deployment
2. Go to **"Build Logs"** tab
3. Look for:
   - ✅ "Build Completed"
   - ✅ No errors about database synchronize
   - ❌ If you see errors, check them

### 4.2 Test Health Endpoint

Open in browser:
```
https://your-project-name.vercel.app/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","uptime":...}
```

### 4.3 Check Function Logs

1. Go to **Deployments** → Latest deployment
2. Click **"Functions"** tab
3. Click on `api/index`
4. Check **"Logs"** tab

**Look for:**
- ✅ "✅ Database synchronize is DISABLED" (in logs)
- ❌ No errors about schema conflicts

---

## Step 5: Update Flutter App (If Needed)

If your Flutter app is pointing to Vercel:

1. Edit `frontend/lib/core/constants/api_constants.dart`
2. Make sure it's using your Vercel URL:
   ```dart
   static String get baseUrl {
     return 'https://your-project-name.vercel.app/api';
   }
   ```
3. Hot restart Flutter app

---

## Troubleshooting

### Build Fails

**Error: "Missing required database configuration"**
- Check all `DB_*` variables are set in Vercel
- Verify values are correct

**Error: "Cannot connect to database"**
- Check `DB_HOST` is correct
- Verify `DB_SSL=true` for Supabase
- Check database allows external connections

### Function Crashes (500 Error)

**Check Function Logs:**
1. Deployments → Functions → api/index → Logs

**Common Errors:**

**"column contains null values"**
- This means synchronize tried to run
- Make sure `DB_SYNC` is NOT set or set to `false` in Vercel
- Redeploy

**"Missing required database configuration"**
- Check all environment variables are set
- Make sure they're set for **Production** environment

### Still Crashing?

1. **Check Function Logs** - Share the exact error
2. **Verify Environment Variables** - Make sure all are set
3. **Check Database** - Make sure Supabase is accessible

---

## Quick Checklist

Before redeploying:

- [ ] Code committed and pushed to GitHub
- [ ] `DB_SYNC` is NOT set (or set to `false`) in Vercel
- [ ] All other environment variables are set
- [ ] Database is accessible (Supabase)

After redeploying:

- [ ] Build completed successfully
- [ ] Health endpoint works
- [ ] Function logs show no errors
- [ ] Flutter app can connect (if applicable)

---

## Your Vercel URL

After redeployment, your backend will be at:
```
https://your-project-name.vercel.app/api
```

**That's it! Your backend should now work without crashes.** 🎉

