# 🔄 Switching from SQLite to PostgreSQL

## Quick Steps

### 1. Set Up PostgreSQL Database

Choose one:
- **Supabase** (easiest): https://supabase.com
- **Neon**: https://neon.tech
- **Railway**: https://railway.app

See `POSTGRESQL_SETUP.md` for detailed instructions.

### 2. Update .env File

Edit `backend/.env`:

```env
# Change from SQLite:
# DB_TYPE=sqlite
# DB_DATABASE=database.sqlite

# To PostgreSQL:
DB_TYPE=postgres
DB_HOST=db.xxxxx.supabase.co          # Your database host
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_DATABASE=postgres
DB_SSL=true                           # true for cloud, false for local
```

### 3. Restart Backend

```bash
cd backend
npm run start:dev
```

### 4. Verify

- ✅ Backend starts without errors
- ✅ Database connection successful
- ✅ Tables created automatically
- ✅ Can register/login users

---

## What Changed

- ✅ Removed SQLite support from code
- ✅ PostgreSQL is now required
- ✅ Better error handling for database connection
- ✅ Works with Vercel deployment

---

## Old SQLite Database

Your old `database.sqlite` file is still there but won't be used.

**To clean up:**
```bash
cd backend
# Optional: backup first
Copy-Item database.sqlite database.sqlite.backup
# Then delete
Remove-Item database.sqlite
```

---

## Need Help?

- See `POSTGRESQL_SETUP.md` for database setup
- See `VERCEL_DEPLOYMENT_STEP_BY_STEP.md` for deployment

