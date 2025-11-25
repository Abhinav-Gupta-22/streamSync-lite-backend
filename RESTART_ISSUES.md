# 🔄 Backend Restart Issues - Connection Timeout After Restarting Next Day

## Why This Happens

When you restart your backend server after a day (or any extended period), you might experience connection timeouts. This typically happens because:

### 1. **Database Connection Issues** (Most Common)
- **PostgreSQL**: If you're using PostgreSQL, the database server might not be running
- **Stale Connections**: Database connections may have timed out or been closed
- **Connection Pool**: Old connections in the pool may be invalid

### 2. **Database Server Not Running**
- If using local PostgreSQL, the service might have stopped
- Cloud databases might have gone to sleep (free tier databases often do this)

### 3. **Network/Firewall Issues**
- Windows Firewall might have reset rules
- Network configuration might have changed

## Quick Fixes

### Fix 1: Check Database Server Status

**For PostgreSQL (Local):**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# If not running, start it:
Start-Service -Name postgresql-x64-XX  # Replace XX with your version
```

**For Cloud Databases (Supabase, Neon, etc.):**
- Check your database dashboard
- Some free tier databases go to sleep after inactivity
- Wake them up by connecting or check their dashboard

### Fix 2: Use SQLite for Local Development (Easiest)

If you're developing locally, SQLite is the easiest option:

1. Edit `backend/.env`:
```env
DB_TYPE=sqlite
DB_DATABASE=database.sqlite
```

2. Restart backend:
```bash
cd backend
npm run start:dev
```

SQLite doesn't require a separate server and works immediately.

### Fix 3: Verify Backend Started Successfully

After restarting, check the console output:

**✅ Good Output:**
```
🚀 Application is running on: http://localhost:3000/api
📱 Accessible from Android emulator at: http://10.0.2.2:3000/api
```

**❌ Bad Output (Database Error):**
```
❌ Missing required database environment variables
Error: Missing required database configuration
```

If you see database errors, fix your `.env` file first.

### Fix 4: Test Backend Before Using Flutter App

Always test the backend in your browser first:

1. Open: `http://localhost:3000/api/health`
2. You should see: `{"status":"ok","timestamp":"...","uptime":...}`
3. If this works, the backend is running correctly ✅

### Fix 5: Check Port 3000

Make sure port 3000 is available:

```powershell
netstat -ano | findstr :3000
```

If you see output, something is using port 3000. Kill it or change the port in `.env`.

## Prevention Tips

### 1. **Always Start Database Before Backend**

If using PostgreSQL locally:
```powershell
# Start PostgreSQL service
Start-Service -Name postgresql-x64-XX

# Then start backend
cd backend
npm run start:dev
```

### 2. **Use SQLite for Development**

SQLite is perfect for local development:
- No separate server needed
- Works immediately
- No connection issues
- Easy to reset (just delete the `.sqlite` file)

### 3. **Check Backend Console**

Always check the backend console for errors before using the Flutter app. Look for:
- Database connection errors
- Missing environment variables
- Port conflicts

### 4. **Test Health Endpoint**

Before using the Flutter app, test:
```
http://localhost:3000/api/health
```

If this doesn't work, the backend isn't running properly.

## What We Fixed

We've improved the backend to handle connection issues better:

1. **Increased Retry Attempts**: From 3 to 5 retries
2. **Better Timeout Handling**: Increased connection timeout to 15 seconds
3. **Connection Pool Improvements**: Better idle connection handling
4. **Graceful Error Handling**: App won't crash on initial connection failure

However, you still need to ensure:
- Database server is running (if using PostgreSQL)
- `.env` file is configured correctly
- Backend starts successfully (check console)

## Still Having Issues?

1. **Check Backend Console**: Look for error messages
2. **Verify `.env` File**: Make sure all required variables are set
3. **Test Health Endpoint**: `http://localhost:3000/api/health`
4. **Use SQLite**: Switch to SQLite for local development (easiest solution)
5. **Check Database Status**: Ensure database server is running

## Recommended Setup for Local Development

For the easiest local development experience:

```env
# backend/.env
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Use SQLite - no server needed!
DB_TYPE=sqlite
DB_DATABASE=database.sqlite
```

This setup:
- ✅ Works immediately after restart
- ✅ No database server needed
- ✅ No connection issues
- ✅ Easy to reset (delete `.sqlite` file)

