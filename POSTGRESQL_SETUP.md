# 🐘 PostgreSQL Setup Guide

## Why PostgreSQL?

- ✅ Required for Vercel deployment (SQLite doesn't work on serverless)
- ✅ Better for production
- ✅ Supports concurrent connections
- ✅ More features and scalability

## Quick Setup Options

### Option 1: Supabase (Recommended - Easiest)

**Free Tier:** 500MB database, unlimited API requests

1. Go to https://supabase.com
2. Sign up / Login
3. Click **"New Project"**
4. Fill in:
   - **Name**: streamsync-backend
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes
7. Go to **Project Settings** → **Database**
8. Copy connection details:
   - **Host**: `db.xxxxx.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: (the one you created)

### Option 2: Neon (Serverless PostgreSQL)

**Free Tier:** 0.5GB database, auto-scaling

1. Go to https://neon.tech
2. Sign up / Login
3. Click **"Create Project"**
4. Copy connection details from dashboard

### Option 3: Railway

**Free Tier:** $5 credit monthly

1. Go to https://railway.app
2. Sign up / Login
3. Click **"New Project"** → **"Provision PostgreSQL"**
4. Copy connection details

### Option 4: Local PostgreSQL (Advanced)

If you have PostgreSQL installed locally:

1. Create database:
   ```sql
   CREATE DATABASE streamsync_db;
   CREATE USER streamsync WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE streamsync_db TO streamsync;
   ```

2. Use connection:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=streamsync
   DB_PASSWORD=your_password
   DB_DATABASE=streamsync_db
   DB_SSL=false
   ```

---

## Update Your .env File

Edit `backend/.env` and set:

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=db.xxxxx.supabase.co          # Your database host
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here       # Your database password
DB_DATABASE=postgres
DB_SSL=true                           # true for cloud databases, false for local
```

---

## Test Connection

After updating `.env`, restart your backend:

```bash
cd backend
npm run start:dev
```

You should see:
- ✅ Database connection successful
- ✅ Tables created automatically (in development mode)
- ✅ No SQLite errors

---

## Migrate Data from SQLite (Optional)

If you have existing data in SQLite and want to migrate:

### Method 1: Export/Import (Manual)

1. **Export from SQLite:**
   ```bash
   sqlite3 database.sqlite .dump > dump.sql
   ```

2. **Convert SQL for PostgreSQL:**
   - Remove SQLite-specific syntax
   - Update data types (timestamp → datetime)
   - Fix AUTOINCREMENT → SERIAL

3. **Import to PostgreSQL:**
   ```bash
   psql -h your-host -U postgres -d postgres -f dump.sql
   ```

### Method 2: Use Database Tool

1. Use **DB Browser for SQLite** to export data to CSV
2. Use **pgAdmin** or **DBeaver** to import CSV to PostgreSQL

### Method 3: Start Fresh (Easiest)

If you don't have important data:
1. Delete `backend/database.sqlite`
2. Start backend with PostgreSQL
3. Tables will be created automatically
4. Register new users

---

## Verify PostgreSQL Connection

### Test from Command Line

```bash
# If you have psql installed
psql -h your-host -U postgres -d postgres

# Or test connection
psql "postgresql://postgres:password@host:5432/postgres?sslmode=require"
```

### Check Backend Logs

When you start the backend, you should see:
```
✅ Database connection established
```

If you see errors:
- Check database credentials
- Verify database is accessible
- Check firewall settings
- For cloud databases, ensure SSL is enabled

---

## Troubleshooting

### Error: "Cannot connect to database"

**Check:**
1. Database credentials are correct
2. Database is running (for local) or accessible (for cloud)
3. Firewall allows connections
4. SSL is enabled for cloud databases (`DB_SSL=true`)

### Error: "Password authentication failed"

- Verify password is correct
- Check for extra spaces in `.env`
- Make sure password doesn't have special characters that need escaping

### Error: "Database does not exist"

- Verify `DB_DATABASE` name is correct
- For Supabase/Neon, usually it's `postgres`
- Create database if using local PostgreSQL

### Error: "Connection timeout"

- Check database host is correct
- Verify database is accessible from your network
- For cloud databases, check if they're "sleeping" (free tier)
- Try connecting from database dashboard first

---

## Next Steps

1. ✅ Update `.env` with PostgreSQL credentials
2. ✅ Restart backend
3. ✅ Verify connection works
4. ✅ Test API endpoints
5. ✅ Deploy to Vercel (will use same PostgreSQL)

---

## For Vercel Deployment

Use the same PostgreSQL database for Vercel:
- Set all `DB_*` environment variables in Vercel
- Use `DB_SSL=true` for cloud databases
- Same credentials work for both local and Vercel

---

**Need help?** Check the deployment guide: `VERCEL_DEPLOYMENT_STEP_BY_STEP.md`

