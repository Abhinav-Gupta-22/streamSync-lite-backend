# 🔧 Fix PostgreSQL Schema Migration Issue

## The Problem

Your PostgreSQL database has existing tables with NULL values in date columns. When TypeORM tries to change these columns to `NOT NULL`, it fails because PostgreSQL won't allow adding a `NOT NULL` constraint to a column that contains NULL values.

## Quick Fix: Drop and Recreate Tables (Easiest)

If you don't have important data in your PostgreSQL database:

### Option 1: Use SQL Script

1. Connect to your PostgreSQL database (using Supabase dashboard, pgAdmin, or psql)
2. Run this SQL:

```sql
DROP TABLE IF EXISTS "notification_jobs" CASCADE;
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "favorites" CASCADE;
DROP TABLE IF EXISTS "progress" CASCADE;
DROP TABLE IF EXISTS "fcm_tokens" CASCADE;
DROP TABLE IF EXISTS "videos" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
```

3. Restart your backend - TypeORM will recreate all tables with correct schema

### Option 2: Use Supabase Dashboard

1. Go to your Supabase project
2. Click **"SQL Editor"**
3. Paste the DROP TABLE commands above
4. Click **"Run"**
5. Restart your backend

### Option 3: Fix Existing Data (If you have data to keep)

If you have important data, update NULL values first:

```sql
-- Fix NULL values
UPDATE "videos" SET "published_at" = CURRENT_TIMESTAMP WHERE "published_at" IS NULL;
UPDATE "notifications" SET "received_at" = CURRENT_TIMESTAMP WHERE "received_at" IS NULL;
UPDATE "notification_jobs" SET "processing_at" = CURRENT_TIMESTAMP WHERE "processing_at" IS NULL;

-- Then make columns NOT NULL
ALTER TABLE "videos" ALTER COLUMN "published_at" SET NOT NULL;
```

## Step-by-Step: Supabase

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"**

3. **Run Drop Tables Script**
   ```sql
   DROP TABLE IF EXISTS "notification_jobs" CASCADE;
   DROP TABLE IF EXISTS "notifications" CASCADE;
   DROP TABLE IF EXISTS "favorites" CASCADE;
   DROP TABLE IF EXISTS "progress" CASCADE;
   DROP TABLE IF EXISTS "fcm_tokens" CASCADE;
   DROP TABLE IF EXISTS "videos" CASCADE;
   DROP TABLE IF EXISTS "users" CASCADE;
   ```

4. **Click "Run"**

5. **Restart Backend**
   ```bash
   cd backend
   npm run start:dev
   ```

TypeORM will automatically create all tables with the correct schema!

## Verify

After restarting, check backend console:
- ✅ Should see: "Database connection established"
- ✅ No errors about NULL values
- ✅ Tables created successfully

## Alternative: Disable Synchronize

If you want to use migrations instead:

1. Edit `backend/src/config/typeorm.config.ts`
2. Change `synchronize: true` to `synchronize: false`
3. Create and run migrations manually

But for development, dropping and recreating is easier.

---

**After fixing, your backend should start successfully!** 🎉

