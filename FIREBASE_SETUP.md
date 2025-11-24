# Firebase Admin SDK Setup Guide

This guide will help you set up Firebase Admin SDK credentials for push notifications.

## Step 1: Create/Select Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Note your **Project ID** (visible in project settings)

## Step 2: Enable Cloud Messaging API

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Click on **Cloud Messaging** tab
3. Ensure Cloud Messaging API is enabled

## Step 3: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project from the dropdown
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Click **Create Service Account**
5. Fill in:
   - **Service account name**: `streamsync-admin` (or any name)
   - **Service account ID**: auto-generated
   - Click **Create and Continue**
6. Grant role: **Firebase Cloud Messaging Admin** (or **Editor**)
7. Click **Continue** then **Done**

## Step 4: Generate Service Account Key

1. In **Service Accounts** page, find your newly created service account
2. Click on the service account email
3. Go to **Keys** tab
4. Click **Add Key** > **Create new key**
5. Select **JSON** format
6. Click **Create**
7. A JSON file will be downloaded (e.g., `your-project-firebase-adminsdk-xxxxx.json`)

## Step 5: Extract Values from JSON

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## Step 6: Map JSON to .env File

Copy values from JSON to your `.env` file:

```env
# Firebase Admin SDK (for Push Notifications)
FIREBASE_PROJECT_ID=your-project-id                    # From "project_id"
FIREBASE_PRIVATE_KEY_ID=abc123def456...                # From "private_key_id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"  # From "private_key" (keep quotes and \n)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com  # From "client_email"
FIREBASE_CLIENT_ID=123456789012345678901               # From "client_id"
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth  # From "auth_uri"
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token        # From "token_uri"
```

## Step 7: Format the Private Key Correctly

**IMPORTANT**: The `FIREBASE_PRIVATE_KEY` must be on a single line with `\n` to represent newlines.

### Option A: Manual Formatting
1. Copy the entire `private_key` value from JSON (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
2. Replace all actual newlines with `\n` (backslash + n)
3. Wrap the entire string in double quotes

Example:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### Option B: Use a Script (Recommended)

Create a file `extract-firebase-key.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Read the JSON file
const jsonPath = process.argv[2] || './your-project-firebase-adminsdk-xxxxx.json';
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('\n# Add these to your .env file:\n');
console.log(`FIREBASE_PROJECT_ID=${json.project_id}`);
console.log(`FIREBASE_PRIVATE_KEY_ID=${json.private_key_id}`);
console.log(`FIREBASE_PRIVATE_KEY="${json.private_key.replace(/\n/g, '\\n')}"`);
console.log(`FIREBASE_CLIENT_EMAIL=${json.client_email}`);
console.log(`FIREBASE_CLIENT_ID=${json.client_id}`);
console.log(`FIREBASE_AUTH_URI=${json.auth_uri}`);
console.log(`FIREBASE_TOKEN_URI=${json.token_uri}`);
```

Run it:
```bash
node extract-firebase-key.js path/to/your-firebase-key.json
```

## Step 8: Verify Your .env File

Your `.env` file should look like this (with your actual values):

```env
# Firebase Admin SDK (for Push Notifications)
FIREBASE_PROJECT_ID=streamsync-lite-12345
FIREBASE_PRIVATE_KEY_ID=abc123def456ghi789jkl012mno345pq
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc12@streamsync-lite-12345.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789012345678901
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

## Step 9: Test the Configuration

1. Start your backend:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Check the logs - you should see:
   - No Firebase initialization errors
   - Server starting successfully

3. If you see warnings about Firebase credentials, double-check:
   - All values are set correctly
   - Private key has `\n` instead of actual newlines
   - Private key is wrapped in double quotes

## Troubleshooting

### Error: "Firebase credentials not configured"
- Check that all Firebase variables are set in `.env`
- Verify `.env` file is in the `backend/` directory
- Restart the server after changing `.env`

### Error: "Invalid private key"
- Ensure private key is on a single line with `\n` for newlines
- Check that quotes are properly escaped
- Verify the key starts with `-----BEGIN PRIVATE KEY-----`

### Error: "Permission denied"
- Ensure the service account has **Firebase Cloud Messaging Admin** role
- Check that Cloud Messaging API is enabled in Google Cloud Console

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit the `.env` file or the JSON key file to git
- The `.env` file is already in `.gitignore`
- Store the JSON key file securely
- In production, use AWS Systems Manager Parameter Store or similar

## Quick Reference

| .env Variable | JSON Field | Example |
|--------------|------------|---------|
| `FIREBASE_PROJECT_ID` | `project_id` | `streamsync-lite-12345` |
| `FIREBASE_PRIVATE_KEY_ID` | `private_key_id` | `abc123def456...` |
| `FIREBASE_PRIVATE_KEY` | `private_key` | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` |
| `FIREBASE_CLIENT_EMAIL` | `client_email` | `firebase-adminsdk-xxx@project.iam.gserviceaccount.com` |
| `FIREBASE_CLIENT_ID` | `client_id` | `123456789012345678901` |
| `FIREBASE_AUTH_URI` | `auth_uri` | `https://accounts.google.com/o/oauth2/auth` |
| `FIREBASE_TOKEN_URI` | `token_uri` | `https://oauth2.googleapis.com/token` |

---

**Need help?** Check the [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
