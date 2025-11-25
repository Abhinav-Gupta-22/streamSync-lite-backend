# 🔧 Fix Server Crash - Step by Step

## The Problem

Your server is crashing because TypeORM's `synchronize` is trying to modify the database schema, but there are conflicts (like NULL values in NOT NULL columns).

## Quick Fix Options

### Option 1: Disable Synchronize (Recommended for Production)

**For Local Development:**

Edit `backend/.env`:
```env
# Add this line to disable auto-sync
DB_SYNC=false
```

Then update `backend/src/config/typeorm.config.ts` to check this variable.

**For Vercel:**
Synchronize is already disabled for Vercel, but make sure `NODE_ENV=production` is set.

### Option 2: Fix Database Schema First

If you want to keep synchronize enabled, fix the database first:

1. **Go to Supabase SQL Editor**
2. **Run this SQL:**

```sql
-- Fix NULL values in published_at
UPDATE videos 
SET published_at = COALESCE(published_at, NOW()) 
WHERE published_at IS NULL;

-- Fix NULL values in received_at
UPDATE notifications 
SET received_at = COALESCE(received_at, NOW()) 
WHERE received_at IS NULL;

-- Fix NULL values in processing_at
UPDATE notification_jobs 
SET processing_at = COALESCE(processing_at, NOW()) 
WHERE processing_at IS NULL;
```

3. **Then restart backend**

### Option 3: Drop All Tables (Clean Start)

If you don't need the data:

1. **Go to Supabase SQL Editor**
2. **Run this SQL:**

```sql
DROP TABLE IF EXISTS "notification_jobs" CASCADE;
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "favorites" CASCADE;
DROP TABLE IF EXISTS "progress" CASCADE;
DROP TABLE IF EXISTS "fcm_tokens" CASCADE;
DROP TABLE IF EXISTS "videos" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
```

3. **Restart backend** - TypeORM will recreate tables

---

## Step-by-Step Fix (Choose One)

### 🎯 Recommended: Disable Synchronize

**Step 1:** Update TypeORM config to respect `DB_SYNC`:

The config already checks `isVercel`, but we should also check a `DB_SYNC` env variable.

**Step 2:** Add to `.env`:
```env
DB_SYNC=false
```

**Step 3:** Restart backend:
```bash
npm run start:dev
```

---

## Check What's Causing the Crash

### 1. Check Backend Logs

Look for these errors:
- `column "published_at" contains null values` → Schema issue
- `Missing required database configuration` → Env vars missing
- `Connection refused` → Database not accessible
- `timeout` → Database connection timeout

### 2. Test Database Connection

Run this in Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM videos;
SELECT COUNT(*) FROM users;
```

If these work, database is accessible.

### 3. Check Environment Variables

Make sure all are set:
```bash
# In backend directory
Get-Content .env | Select-String "DB_"
```

Should show:
- `DB_TYPE=postgres`
- `DB_HOST=...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`
- `DB_DATABASE=...`
- `DB_SSL=true`

---

## For Vercel Deployment

If deploying to Vercel and it crashes:

1. **Check Function Logs** in Vercel dashboard
2. **Verify all environment variables** are set
3. **Make sure `NODE_ENV=production`** is set
4. **Synchronize is already disabled** for Vercel (code checks `isVercel`)

---

## Still Crashing?

Share the exact error message from:
- Backend console (if local)
- Vercel Function Logs (if deployed)

Then I can provide a specific fix!

