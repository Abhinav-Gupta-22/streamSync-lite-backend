# Vercel Deployment Guide

## Prerequisites

1. All environment variables must be set in Vercel dashboard
2. Database connection must be configured (PostgreSQL recommended for production)
3. Firebase credentials must be set as environment variables

## Environment Variables Required

Set these in your Vercel project settings:

### Database
- `DB_TYPE=postgres`
- `DB_HOST=your-database-host`
- `DB_PORT=5432`
- `DB_USERNAME=your-username`
- `DB_PASSWORD=your-password`
- `DB_DATABASE=your-database-name`
- `DB_SSL=true` (for cloud databases)

### JWT
- `JWT_SECRET=your-jwt-secret`
- `JWT_EXPIRATION=7d`
- `JWT_REFRESH_SECRET=your-refresh-secret`
- `JWT_REFRESH_EXPIRATION=30d`

### Firebase
- `FIREBASE_PROJECT_ID=your-project-id`
- `FIREBASE_PRIVATE_KEY_ID=your-private-key-id`
- `FIREBASE_PRIVATE_KEY=your-private-key` (with \n for newlines)
- `FIREBASE_CLIENT_EMAIL=your-client-email`
- `FIREBASE_CLIENT_ID=your-client-id`
- `FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth`
- `FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token`

### YouTube API
- `YOUTUBE_API_KEY=your-youtube-api-key`
- `YOUTUBE_CHANNEL_ID=your-channel-id`
- `YOUTUBE_CACHE_TTL_MINUTES=10`

### Application
- `NODE_ENV=production`
- `PORT=3000` (Vercel handles this automatically)
- `API_PREFIX=api`

## Deployment Steps

1. Connect your GitHub repository to Vercel
2. **IMPORTANT**: Set the **Root Directory** to `backend` in Vercel project settings:
   - Go to Project Settings → General
   - Find "Root Directory" section
   - Click "Edit" and set it to `backend`
   - Save
3. Set all environment variables in Vercel dashboard (Settings → Environment Variables)
4. Deploy (push to GitHub or trigger manual deployment)

## Vercel Project Settings Checklist

- [ ] Root Directory set to `backend`
- [ ] Framework Preset: "Other" or "None"
- [ ] Build Command: `npm run build` (optional, Vercel will auto-detect)
- [ ] Output Directory: Leave empty (not needed for serverless)
- [ ] Install Command: `npm install`
- [ ] Node.js Version: 18.x or higher

## Important Notes

- The API is accessible at: `https://your-domain.vercel.app/api`
- Health check endpoint: `https://your-domain.vercel.app/api/health`
- SQLite is NOT supported on Vercel (use PostgreSQL)
- Make sure `synchronize: false` in production (use migrations instead)

## Troubleshooting

### 500 Internal Server Error
- Check Vercel function logs
- Verify all environment variables are set
- Ensure database connection is working
- Check that Firebase credentials are correct

### Database Connection Issues
- Verify database allows connections from Vercel IPs
- Check SSL settings (most cloud databases require SSL)
- Ensure database credentials are correct

### Function Timeout
- Vercel free tier has 10s timeout for Hobby plan
- Consider upgrading or optimizing slow endpoints

