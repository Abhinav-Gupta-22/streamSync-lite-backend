# 🚀 QUICK FIX: Database Connection Issue

## The Problem
Your backend is timing out because the database connection is failing. When the FCM token endpoint tries to save to the database, it hangs waiting for a connection.

## The Solution: Use SQLite (30 seconds)

### Step 1: Edit `.env` file
Open `backend/.env` and change/add these lines:

```env
DB_TYPE=sqlite
DB_DATABASE=database.sqlite
```

**Remove or comment out PostgreSQL settings:**
```env
# DB_TYPE=postgres
# DB_HOST=...
# DB_USERNAME=...
# DB_PASSWORD=...
# DB_DATABASE=...
```

### Step 2: Restart Backend
```powershell
# Stop the backend (Ctrl+C)
# Then restart:
cd backend
npm run start:dev
```

### Step 3: Test
Try your Flutter app again - it should work now!

## Why This Works
- SQLite doesn't need a separate database server
- Works immediately after restart
- No connection issues
- Perfect for local development

## If You Must Use PostgreSQL

1. **Check if PostgreSQL is running:**
   ```powershell
   Get-Service -Name postgresql*
   ```

2. **Start PostgreSQL if needed:**
   ```powershell
   Start-Service -Name postgresql-x64-XX  # Replace XX with your version
   ```

3. **Verify connection in `.env`:**
   ```env
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   ```

## Check Backend Console

When you try the Flutter app, check the backend console:

**✅ If you see:**
```
📥 POST /api/users/.../fcmToken - ::ffff:10.0.2.2
```
The request is reaching the backend!

**❌ If you DON'T see any request logs:**
- Windows Firewall is blocking
- Backend isn't listening on 0.0.0.0
- Network issue

**⏳ If you see request but it hangs:**
- Database connection issue (use SQLite fix above)

