# 🎥 YouTube API Setup Guide

## The Problem

You're getting a **403 Forbidden** error from YouTube API. This means:
- API key is missing, invalid, or expired
- API quota has been exceeded
- API key doesn't have required permissions

## Quick Fix: Get a YouTube API Key

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "StreamSync")
4. Click "Create"

### Step 2: Enable YouTube Data API v3

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "YouTube Data API v3"
3. Click on it and click **"Enable"**

### Step 3: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the API key
4. (Optional) Click "Restrict Key" to limit usage:
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Click "Save"

### Step 4: Add API Key to Backend

1. Open `backend/.env` file
2. Add or update:
   ```env
   YOUTUBE_API_KEY=your_api_key_here
   YOUTUBE_CHANNEL_ID=UC80PWRj_ZU8Zu0HSMNVwKWw
   ```
3. Replace `your_api_key_here` with your actual API key
4. Save the file
5. **Restart the backend** (Ctrl+C and `npm run start:dev`)

## Free Tier Limits

- **10,000 units per day** (free quota)
- Each API call costs units:
  - Search: 100 units
  - Video details: 1 unit
  - Channel info: 1 unit

**Daily limit:** ~100 search requests per day (free tier)

## If You Exceed Quota

1. **Wait 24 hours** for quota to reset
2. **Or upgrade** to paid tier in Google Cloud Console
3. **Or use cached data** - the app will use cached videos when API fails

## Test Your API Key

```powershell
# Test if API key works
$apiKey = "YOUR_API_KEY"
Invoke-WebRequest -Uri "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC80PWRj_ZU8Zu0HSMNVwKWw&maxResults=1&key=$apiKey"
```

If it returns data, your API key is working!

## Current Behavior

The app will:
- ✅ Use cached videos when API fails
- ✅ Show error in backend console
- ✅ Continue working with existing cached data
- ❌ Won't fetch new videos until API key is fixed

## Troubleshooting

### Error: "API key not valid"
- Check if API key is correct in `.env`
- Make sure there are no extra spaces
- Restart backend after changing `.env`

### Error: "Quota exceeded"
- You've used all free quota for today
- Wait 24 hours or upgrade to paid tier
- App will use cached videos in the meantime

### Error: "API key not found"
- Make sure `YOUTUBE_API_KEY` is set in `backend/.env`
- Check spelling (case-sensitive)
- Restart backend after adding

## Alternative: Use Without YouTube API

If you don't want to use YouTube API:
1. The app will use cached videos from database
2. You can manually add videos to database using DB Browser
3. Or use mock/test data

## Need Help?

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- Check backend console for detailed error messages

