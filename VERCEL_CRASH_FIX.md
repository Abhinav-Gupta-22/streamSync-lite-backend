# 🔧 Fix Vercel Server Crash - Step by Step

## The Error

You're seeing:
- **500: INTERNAL_SERVER_ERROR**
- **Code: `FUNCTION_INVOCATION_FAILED`**

This means the serverless function is crashing during initialization.

---

## Step 1: Check Vercel Function Logs (Most Important!)

### 1.1 Go to Function Logs

1. Open https://vercel.com/dashboard
2. Click your project
3. Go to **Deployments** tab
4. Click on the **latest deployment** (the one that's failing)
5. Click **"Functions"** tab
6. Click on **`api/index`**
7. Click **"Logs"** tab

### 1.2 Look for the Error

**Common errors you might see:**

**Error 1: Missing Database Variables**
```
❌ Missing required database environment variables:
  DB_HOST: ✗ MISSING
  DB_USERNAME: ✗ MISSING
```
**Fix:** Set all `DB_*` variables in Vercel

**Error 2: Database Connection Failed**
```
Error: connect ECONNREFUSED
```
**Fix:** Check database host, SSL settings

**Error 3: Schema Error**
```
column "published_at" contains null values
```
**Fix:** Make sure `DB_SYNC` is NOT set or set to `false`

**Error 4: JWT Secret Missing**
```
JWT_SECRET is required
```
**Fix:** Set `JWT_SECRET` and `JWT_REFRESH_SECRET`

---

## Step 2: Verify Environment Variables on Vercel

### 2.1 Go to Environment Variables

1. Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**

### 2.2 Required Variables Checklist

Make sure ALL of these are set:

**Database:**
- [ ] `DB_TYPE` = `postgres`
- [ ] `DB_HOST` = `db.xafmqyqhfltddaosyczy.supabase.co` (your Supabase host)
- [ ] `DB_PORT` = `5432`
- [ ] `DB_USERNAME` = `postgres`
- [ ] `DB_PASSWORD` = `AbhiGup@122` (your actual password)
- [ ] `DB_DATABASE` = `postgres`
- [ ] `DB_SSL` = `true`

**JWT:**
- [ ] `JWT_SECRET` = (random 32+ character string)
- [ ] `JWT_EXPIRATION` = `7d`
- [ ] `JWT_REFRESH_SECRET` = (different random string)
- [ ] `JWT_REFRESH_EXPIRATION` = `30d`

**App:**
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `API_PREFIX` = `api`

**Optional:**
- [ ] `YOUTUBE_API_KEY` = (your key)
- [ ] `YOUTUBE_CHANNEL_ID` = (your channel ID)

**Important:**
- [ ] `DB_SYNC` = **NOT SET** or `false` (do NOT set to `true`!)

### 2.3 Check Environment Scope

Make sure each variable is set for:
- ✅ **Production**
- ✅ **Preview** (optional but recommended)
- ✅ **Development** (optional)

---

## Step 3: Fix Common Issues

### Issue 1: Using Wrong Database Host

**Problem:** Using pooler URL instead of direct connection

**Your DATABASE_URL shows:**
```
aws-1-ap-northeast-2.pooler.supabase.com:6543
```

**But you need the DIRECT connection:**
```
db.xafmqyqhfltddaosyczy.supabase.co:5432
```

**Fix:**
1. Go to Supabase Dashboard
2. **Project Settings** → **Database**
3. Copy **"Host"** (should be `db.xxxxx.supabase.co`)
4. Use port **5432** (not 6543)
5. Update `DB_HOST` in Vercel

### Issue 2: Password with Special Characters

If your password has `@` or other special characters:
- Make sure it's properly escaped in Vercel
- Or use connection string format

### Issue 3: SSL Not Enabled

**Fix:**
- Set `DB_SSL` = `true` in Vercel
- Required for Supabase cloud databases

---

## Step 4: Test Database Connection

### 4.1 Test from Supabase

1. Go to Supabase Dashboard
2. **SQL Editor** → **New Query**
3. Run:
   ```sql
   SELECT version();
   ```
4. Should return PostgreSQL version

### 4.2 Verify Connection String

From your `.env`, the connection should be:
```
Host: db.xafmqyqhfltddaosyczy.supabase.co
Port: 5432
User: postgres
Password: AbhiGup@122
Database: postgres
SSL: Required
```

---

## Step 5: Redeploy After Fixing

### 5.1 After Updating Environment Variables

1. Go to **Deployments** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Select **"Use existing Build Cache"** = **OFF** (to rebuild)
5. Click **"Redeploy"**

### 5.2 Wait for Build

- Build: 2-3 minutes
- Function initialization: 10-30 seconds
- Watch **Build Logs** for errors

---

## Step 6: Verify It Works

### 6.1 Test Health Endpoint

Open in browser:
```
https://your-project-name.vercel.app/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","uptime":...}
```

### 6.2 Check Function Logs Again

1. Go to latest deployment
2. **Functions** → `api/index` → **Logs**
3. Look for:
   - ✅ "✅ Database synchronize is DISABLED"
   - ✅ "App initialized successfully"
   - ❌ No error messages

---

## Quick Fix Checklist

If still crashing, verify:

- [ ] All `DB_*` variables are set correctly
- [ ] `DB_HOST` uses direct connection (port 5432), not pooler (6543)
- [ ] `DB_SSL` = `true`
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are set and different
- [ ] `DB_SYNC` is NOT set or set to `false`
- [ ] `NODE_ENV` = `production`
- [ ] All variables are set for **Production** environment
- [ ] Code is pushed to GitHub (latest changes)
- [ ] Latest deployment is using new code

---

## Still Crashing?

**Share these details:**

1. **Function Logs** (from Step 1.2)
2. **Build Logs** (any errors during build)
3. **Environment Variables** (which ones are set - don't share values!)

I'll help you fix the specific issue!

