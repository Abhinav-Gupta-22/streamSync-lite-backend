# Windows Firewall Fix for Android Emulator

## The Problem
Android emulator can't connect to backend because Windows Firewall is blocking the connection.

## Quick Fix

### Option 1: Allow Node.js Through Firewall (Recommended)

1. **Open Windows Defender Firewall:**
   - Press `Win + R`
   - Type: `wf.msc`
   - Press Enter

2. **Click "Allow an app or feature through Windows Defender Firewall"** (on the left)

3. **Click "Change settings"** (top right, requires admin)

4. **Find Node.js in the list:**
   - If you see Node.js, check both **Private** and **Public** boxes
   - If Node.js is NOT in the list, click **"Allow another app..."**

5. **Add Node.js manually:**
   - Click "Browse"
   - Navigate to: `C:\Program Files\nodejs\node.exe` (or wherever Node.js is installed)
   - Click "Add"
   - Check both **Private** and **Public** boxes
   - Click "OK"

### Option 2: Add Port Rule (Alternative)

1. **Open Windows Defender Firewall**
2. **Click "Advanced settings"** (on the left)
3. **Click "Inbound Rules"** → **"New Rule"**
4. **Select "Port"** → Next
5. **Select "TCP"** and enter port **3000** → Next
6. **Select "Allow the connection"** → Next
7. **Check all three (Domain, Private, Public)** → Next
8. **Name it: "Node.js Backend Port 3000"** → Finish

### Option 3: Temporarily Disable Firewall (Testing Only)

⚠️ **Only for testing! Don't leave this on!**

1. Open Windows Security
2. Firewall & network protection
3. Turn off for Private network (temporarily)
4. Test your app
5. **Turn it back on immediately after testing!**

## Verify It Works

After fixing firewall:

1. **Restart your backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Test in browser:**
   ```
   http://localhost:3000/api/health
   ```

3. **Test from Flutter app:**
   - Hot restart your Flutter app
   - Try registering again

## Still Not Working?

1. **Check if backend is actually listening on 0.0.0.0:**
   - Look at backend console output
   - Should say: "Application is running on: http://localhost:3000/api"

2. **Check backend main.ts:**
   - Should have: `await app.listen(port, '0.0.0.0');`
   - NOT: `await app.listen(port);`

3. **Try using your computer's IP address instead:**
   - Find your IP: `ipconfig` in Command Prompt
   - Look for "IPv4 Address" (e.g., 192.168.1.100)
   - Update Flutter's `api_constants.dart`:
   ```dart
   return 'http://192.168.1.100:3000/api'; // Your actual IP
   ```

4. **Check antivirus software:**
   - Some antivirus software also has firewalls
   - Temporarily disable to test

