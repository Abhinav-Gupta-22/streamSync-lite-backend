# ⚡ Quick Fix: Server Crash

## ✅ What I Fixed

I've updated the backend to **disable database synchronize by default**. This prevents schema conflicts that cause crashes.

## 🚀 How to Fix Right Now

### Step 1: Restart Backend

```bash
cd backend
npm run start:dev
```

**You should see:**
```
✅ Database synchronize is DISABLED (safer for production).
   To enable: Set DB_SYNC=true in your .env file.
```

### Step 2: If You Need to Sync Schema

If you need TypeORM to auto-create/modify tables, add to `backend/.env`:

```env
DB_SYNC=true
```

**⚠️ Warning:** Only enable this if:
- You're starting with a fresh database, OR
- You've fixed all NULL values in NOT NULL columns

## 🔍 What Changed

1. **Synchronize is now DISABLED by default** (was enabled in development)
2. **You control it** via `DB_SYNC=true` in `.env`
3. **Safer for production** - won't accidentally modify schema

## 📋 If Still Crashing

### Check the Error Message

**If you see:**
- `column "published_at" contains null values` → See `FIX_SERVER_CRASH.md` Option 2
- `Missing required database configuration` → Check your `.env` file
- `Connection refused` → Database not accessible

### Quick Database Fix

If you need to fix NULL values, run in Supabase SQL Editor:

```sql
UPDATE videos SET published_at = COALESCE(published_at, NOW()) WHERE published_at IS NULL;
UPDATE notifications SET received_at = COALESCE(received_at, NOW()) WHERE received_at IS NULL;
UPDATE notification_jobs SET processing_at = COALESCE(processing_at, NOW()) WHERE processing_at IS NULL;
```

Then restart backend.

---

## ✅ Test It

1. Restart backend: `npm run start:dev`
2. Check console - should see "✅ Database synchronize is DISABLED"
3. Test health endpoint: http://localhost:3000/api/health
4. Should work without crashes!

---

**Need more help?** See `FIX_SERVER_CRASH.md` for detailed troubleshooting.

