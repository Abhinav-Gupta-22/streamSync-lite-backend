# Vercel 404 Error Troubleshooting

## Common Causes of 404 NOT_FOUND

### 1. Root Directory Not Set
**Most Common Issue!**

In Vercel Dashboard:
- Go to **Project Settings** → **General**
- Find **"Root Directory"**
- Set it to: `backend`
- **Save** and **Redeploy**

### 2. Check Vercel Build Logs

1. Go to your Vercel project
2. Click on **Deployments** tab
3. Click on the latest deployment
4. Check **"Build Logs"** and **"Function Logs"**

Look for:
- TypeScript compilation errors
- Missing dependencies
- Import errors

### 3. Verify File Structure

Make sure these files exist in your repository:
```
backend/
├── api/
│   └── index.ts    ← Must exist
├── vercel.json     ← Must exist
├── package.json    ← Must exist
└── src/
    └── app.module.ts
```

### 4. Test the Function Directly

After deployment, test:
- `https://your-domain.vercel.app/api/index` - Should work
- `https://your-domain.vercel.app/api/health` - Should work (if health endpoint exists)
- `https://your-domain.vercel.app/` - Should route to /api/index

### 5. Environment Variables

Make sure all required environment variables are set in Vercel:
- Go to **Settings** → **Environment Variables**
- Verify all variables from `env.example` are set
- **Redeploy** after adding variables

### 6. Check Vercel Function Logs

1. Go to **Deployments** → Click on deployment
2. Click **"Functions"** tab
3. Click on `api/index`
4. Check **"Logs"** for runtime errors

### 7. Manual Test

Create a simple test file to verify Vercel can find functions:

Create `backend/api/test.ts`:
```typescript
export default function handler(req: any, res: any) {
  res.json({ message: 'Test function works!' });
}
```

Then test: `https://your-domain.vercel.app/api/test`

If this works but `api/index` doesn't, the issue is in the NestJS setup.

### 8. Force Redeploy

Sometimes Vercel caches old configurations:
1. Go to **Deployments**
2. Click **"..."** on latest deployment
3. Select **"Redeploy"**
4. Check **"Use existing Build Cache"** = OFF
5. Click **"Redeploy"**

## Still Not Working?

1. Check if `vercel.json` is in the correct location (should be in `backend/`)
2. Verify the `api/index.ts` file exports a default function
3. Check TypeScript compilation - run `npm run build` locally
4. Ensure all dependencies are in `package.json` (not just devDependencies)

## Quick Fix Checklist

- [ ] Root Directory set to `backend` in Vercel
- [ ] `backend/vercel.json` exists and is valid JSON
- [ ] `backend/api/index.ts` exists and exports default handler
- [ ] All environment variables are set
- [ ] Build completes successfully (check logs)
- [ ] Function logs show no runtime errors
- [ ] Redeployed after making changes

