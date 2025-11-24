# Backend Connection Troubleshooting

## Quick Fix Steps

### 1. **Make sure backend is running**

Open a **NEW terminal window** and run:

```bash
cd backend
npm run start:dev
```

**You should see:**
```
🚀 Application is running on: http://localhost:3000/api
📱 Accessible from Android emulator at: http://10.0.2.2:3000/api
```

**If you see errors:**
- Database connection errors → Check `.env` file (use SQLite for easiest setup)
- Port already in use → Kill the process using port 3000 or change PORT in `.env`

### 2. **Test backend in browser**

Open your browser and go to:
- `http://localhost:3000/api`

You should see a response (even if it's an error page, that means server is running).

### 3. **Check Windows Firewall**

Windows might be blocking port 3000:

1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Firewall"
3. Find Node.js and make sure it's checked for both Private and Public networks
4. If Node.js isn't listed, click "Allow another app" and add Node.js

### 4. **Verify .env file exists**

Make sure you have a `.env` file in the `backend` directory:

```bash
cd backend
# Check if .env exists
dir .env
# If not, copy from example
copy env.example .env
```

### 5. **Quick SQLite Setup (Easiest)**

Edit `backend/.env` and set:
```env
DB_TYPE=sqlite
DB_DATABASE=database.sqlite
```

Then restart backend:
```bash
npm run start:dev
```

### 6. **Test connection from command line**

Open PowerShell and test:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api" -Method GET
```

If this works, the backend is running correctly.

### 7. **Check if port 3000 is in use**

```powershell
netstat -ano | findstr :3000
```

If you see output, something is using port 3000. Kill it or use a different port.

## Common Issues

### Issue: "Connection timeout"
**Solution:** Backend is not running or not accessible
- Start backend: `cd backend && npm run start:dev`
- Check firewall settings
- Verify backend started successfully (check console output)

### Issue: "Database connection error"
**Solution:** Use SQLite for local development
- Set `DB_TYPE=sqlite` in `.env`
- Set `DB_DATABASE=database.sqlite` in `.env`
- Restart backend

### Issue: "Port already in use"
**Solution:** 
- Kill process: `taskkill /F /IM node.exe`
- Or change PORT in `.env` to something else (e.g., 3001)
- Update Flutter app's API base URL accordingly

### Issue: Backend starts but crashes immediately
**Solution:**
- Check console for error messages
- Verify `.env` file exists and has correct values
- Make sure all dependencies are installed: `npm install`

## Still Not Working?

1. **Check backend console** - Look for any error messages
2. **Verify Node.js version** - Should be 18+: `node --version`
3. **Reinstall dependencies**: `cd backend && npm install`
4. **Check if backend directory has `.env` file**
5. **Try accessing `http://localhost:3000/api` in browser**

