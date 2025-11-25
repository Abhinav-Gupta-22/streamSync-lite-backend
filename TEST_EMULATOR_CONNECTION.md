# 🔍 Testing Emulator Connection

## Check Backend Console

When you try to register/login from Flutter app, **check your backend terminal**. You should see:

**✅ If working:**
```
📥 POST /api/auth/register - ::ffff:10.0.2.2
📤 POST /api/auth/register - 200 - 45ms
```

**❌ If NOT working:**
- No logs at all = Request not reaching backend (Firewall issue)
- Request logs but hangs = Database issue

## Quick Tests

### Test 1: Backend Health (from your computer)
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/health"
```
Should return: `{"status":"ok",...}`

### Test 2: Check Windows Firewall

1. Open **Windows Defender Firewall**
2. Click **"Allow an app or feature through Windows Firewall"**
3. Find **"Node.js"** and make sure both **Private** and **Public** are checked
4. If Node.js isn't listed:
   - Click **"Allow another app"**
   - Click **"Browse"**
   - Find Node.js (usually in `C:\Program Files\nodejs\node.exe`)
   - Check both **Private** and **Public**
   - Click **OK**

### Test 3: Temporarily Disable Firewall (for testing only)

**⚠️ Only for testing - re-enable after!**

```powershell
# Disable firewall temporarily
netsh advfirewall set allprofiles state off

# Test your app

# Re-enable firewall
netsh advfirewall set allprofiles state on
```

### Test 4: Check Backend Started Successfully

Look at your backend terminal. You should see:

```
✅ BACKEND SERVER STARTED SUCCESSFULLY
🚀 Local:      http://localhost:3000/api
📱 Emulator:   http://10.0.2.2:3000/api
```

If you see database errors or connection errors, the backend isn't fully started.

## Most Common Issue: Windows Firewall

Windows Firewall often blocks Node.js from accepting connections from the emulator. The fix above should resolve it.

