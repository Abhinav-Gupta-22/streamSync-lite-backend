# 🚀 How to Start the Backend (Step-by-Step)

## Quick Start

1. **Open a terminal** (PowerShell or Command Prompt)
2. **Navigate to backend folder:**
   ```powershell
   cd backend
   ```
3. **Start the backend:**
   ```powershell
   npm run start:dev
   ```
4. **Wait for this message:**
   ```
   ✅ BACKEND SERVER STARTED SUCCESSFULLY
   🚀 Local:      http://localhost:3000/api
   📱 Emulator:   http://10.0.2.2:3000/api
   ```
5. **Test in browser:**
   - Open: `http://localhost:3000/api/health`
   - You should see: `{"status":"ok",...}`

## If Backend Won't Start

### Step 1: Check for Errors
Look at the terminal output. Common errors:

**❌ Database Connection Error:**
```
❌ Missing required database environment variables
```
**Solution:** Check your `.env` file (see Step 2)

**❌ Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Kill the process using port 3000:
```powershell
netstat -ano | findstr :3000
# Note the PID, then:
taskkill /F /PID <PID>
```

### Step 2: Check .env File

Make sure you have a `.env` file in the `backend` folder:

```powershell
cd backend
dir .env
```

If it doesn't exist, create it:
```powershell
copy env.example .env
```

**For easiest setup, use SQLite:**
Edit `backend/.env` and add:
```env
DB_TYPE=sqlite
DB_DATABASE=database.sqlite
```

### Step 3: Verify Backend is Running

Run the check script:
```powershell
cd backend
.\check-backend.ps1
```

Or test manually:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET
```

## Common Issues

### Issue: "Connection timeout" in Flutter app

**Checklist:**
1. ✅ Is backend running? (Check terminal)
2. ✅ Can you access `http://localhost:3000/api/health` in browser?
3. ✅ Is backend listening on `0.0.0.0:3000`? (Check console output)
4. ✅ Is Windows Firewall blocking Node.js?

**Quick Test:**
```powershell
# Run this script to check everything:
cd backend
.\check-backend.ps1
```

### Issue: Database connection errors

**If using PostgreSQL:**
- Make sure PostgreSQL service is running:
  ```powershell
  Get-Service -Name postgresql*
  Start-Service -Name postgresql-x64-XX  # Replace XX with version
  ```

**Easier solution - Use SQLite:**
- Edit `backend/.env`:
  ```env
  DB_TYPE=sqlite
  DB_DATABASE=database.sqlite
  ```
- Restart backend

### Issue: Backend starts but Flutter can't connect

1. **Check backend console** - Look for the "✅ BACKEND SERVER STARTED" message
2. **Test in browser** - `http://localhost:3000/api/health` should work
3. **Check Windows Firewall** - Allow Node.js through firewall
4. **Verify emulator address** - Flutter should use `http://10.0.2.2:3000`

## Verification Checklist

Before using your Flutter app, verify:

- [ ] Backend terminal shows: "✅ BACKEND SERVER STARTED SUCCESSFULLY"
- [ ] Browser test works: `http://localhost:3000/api/health` returns JSON
- [ ] Port 3000 is listening: `netstat -ano | findstr :3000` shows output
- [ ] No database errors in console (or using SQLite which doesn't need a server)

## Still Having Issues?

1. **Check backend console** for error messages
2. **Run check script:** `.\check-backend.ps1`
3. **Verify .env file** exists and is configured
4. **Try SQLite** for easiest local development
5. **Check Node.js version:** `node --version` (should be 18+)

