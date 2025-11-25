# 🚀 Deploy Backend to Vercel - Step by Step

## Prerequisites ✅

- [x] PostgreSQL database is set up (Supabase/Neon/Railway)
- [x] Backend works locally with PostgreSQL
- [x] Code is pushed to GitHub

---

## Step 1: Prepare Your Code (2 minutes)

### 1.1 Verify Files Exist

Make sure these files are in your repository:
```
backend/
├── api/
│   └── index.ts          ← Must exist
├── vercel.json           ← Must exist
├── package.json          ← Must exist
└── src/                  ← Your source code
```

### 1.2 Commit and Push

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

## Step 2: Create Vercel Project (3 minutes)

### 2.1 Go to Vercel

1. Open https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

### 2.2 Configure Project

**⚠️ CRITICAL SETTINGS:**

1. **Framework Preset**: Select **"Other"**
2. **Root Directory**: 
   - Click **"Edit"** 
   - Type: `backend`
   - Click **"Continue"**
3. **Build Command**: Leave empty (auto-detected)
4. **Output Directory**: Leave empty
5. **Install Command**: `npm install` (or `yarn install`)

**DO NOT CLICK DEPLOY YET!** We need to set environment variables first.

---

## Step 3: Set Environment Variables (10 minutes)

### 3.1 Go to Environment Variables

In the Vercel project setup page, scroll down to **"Environment Variables"** section.

### 3.2 Add Database Variables

Click **"Add"** for each variable:

```
DB_TYPE
Value: postgres
Environments: ✅ Production ✅ Preview ✅ Development
```

```
DB_HOST
Value: db.xxxxx.supabase.co
(Your actual database host from Supabase)
Environments: ✅ Production ✅ Preview ✅ Development
```

```
DB_PORT
Value: 5432
Environments: ✅ Production ✅ Preview ✅ Development
```

```
DB_USERNAME
Value: postgres
Environments: ✅ Production ✅ Preview ✅ Development
```

```
DB_PASSWORD
Value: your_database_password
(Your actual database password)
Environments: ✅ Production ✅ Preview ✅ Development
```

```
DB_DATABASE
Value: postgres
Environments: ✅ Production ✅ Preview ✅ Development
```

```
DB_SSL
Value: true
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3.3 Add JWT Variables

Generate random secrets first (run in terminal):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run it twice to get two different secrets.

Then add:

```
JWT_SECRET
Value: [paste first generated secret]
Environments: ✅ Production ✅ Preview ✅ Development
```

```
JWT_EXPIRATION
Value: 7d
Environments: ✅ Production ✅ Preview ✅ Development
```

```
JWT_REFRESH_SECRET
Value: [paste second generated secret - different from JWT_SECRET]
Environments: ✅ Production ✅ Preview ✅ Development
```

```
JWT_REFRESH_EXPIRATION
Value: 30d
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3.4 Add Application Variables

```
NODE_ENV
Value: production
Environments: ✅ Production ✅ Preview ✅ Development
```

```
PORT
Value: 3000
Environments: ✅ Production ✅ Preview ✅ Development
```

```
API_PREFIX
Value: api
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3.5 Add YouTube API (Optional)

```
YOUTUBE_API_KEY
Value: your_youtube_api_key
Environments: ✅ Production ✅ Preview ✅ Development
```

```
YOUTUBE_CHANNEL_ID
Value: UC80PWRj_ZU8Zu0HSMNVwKWw
(or your channel ID)
Environments: ✅ Production ✅ Preview ✅ Development
```

```
YOUTUBE_CACHE_TTL_MINUTES
Value: 10
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3.6 Add Firebase (Optional - for push notifications)

If you have Firebase set up:

```
FIREBASE_PROJECT_ID
Value: your-project-id
Environments: ✅ Production ✅ Preview ✅ Development
```

```
FIREBASE_PRIVATE_KEY
Value: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
(Keep the \n for newlines)
Environments: ✅ Production ✅ Preview ✅ Development
```

```
FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com
Environments: ✅ Production ✅ Preview ✅ Development
```

(Add other Firebase variables as needed)

---

## Step 4: Deploy (2 minutes)

### 4.1 Click Deploy

After adding all environment variables:
1. Scroll to bottom
2. Click **"Deploy"** button
3. Wait for build to complete (2-5 minutes)

### 4.2 Watch Build Logs

1. Click on the deployment
2. Watch **"Build Logs"** tab
3. Look for:
   - ✅ "Build Completed"
   - ❌ Any errors (fix them)

---

## Step 5: Verify Deployment (2 minutes)

### 5.1 Test Health Endpoint

Open in browser:
```
https://your-project-name.vercel.app/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","uptime":...}
```

### 5.2 Test Other Endpoints

```
https://your-project-name.vercel.app/api/auth/register
```

Should return validation error (which means it's working).

### 5.3 Check Function Logs

1. Go to **Deployments** → Latest deployment
2. Click **"Functions"** tab
3. Click on `api/index`
4. Check **"Logs"** tab for any runtime errors

---

## Step 6: Update Flutter App (1 minute)

### 6.1 Update API Base URL

Edit `frontend/lib/core/constants/api_constants.dart`:

```dart
static String get baseUrl {
  return 'https://your-project-name.vercel.app/api';
}
```

### 6.2 Hot Restart Flutter App

Press `R` in Flutter terminal or restart the app.

---

## Troubleshooting

### Build Fails

**Check:**
- Root Directory = `backend` ✅
- All dependencies in `package.json` ✅
- TypeScript compiles: `npm run build` ✅

**Fix:**
- Check build logs for specific error
- Fix the error
- Commit and push
- Redeploy

### Function Crashes (500 Error)

**Check Function Logs:**
1. Deployments → Functions → api/index → Logs

**Common Errors:**

**"Missing required database configuration"**
- Check all `DB_*` variables are set
- Verify values are correct

**"Cannot connect to database"**
- Check database allows external connections
- Verify `DB_HOST` is correct
- Check `DB_SSL=true` for cloud databases

**"JWT_SECRET is required"**
- Check `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- Make sure they're different values

### 404 Not Found

**Check:**
- Root Directory = `backend` ✅
- `backend/api/index.ts` exists ✅
- `backend/vercel.json` exists ✅

**Fix:**
- Verify Root Directory in Project Settings
- Redeploy

---

## Quick Checklist

Before deploying:

- [ ] Code pushed to GitHub
- [ ] Root Directory set to `backend`
- [ ] All environment variables added
- [ ] Database credentials correct
- [ ] JWT secrets generated and added
- [ ] YouTube API key added (optional)
- [ ] Firebase credentials added (optional)

After deploying:

- [ ] Build completed successfully
- [ ] Health endpoint works
- [ ] Function logs show no errors
- [ ] Flutter app updated with new URL

---

## Your Vercel URL

After deployment, your backend will be available at:
```
https://your-project-name.vercel.app/api
```

Use this URL in your Flutter app!

---

## Need More Help?

See `VERCEL_DEPLOYMENT_STEP_BY_STEP.md` for detailed instructions.

**Good luck! 🚀**

