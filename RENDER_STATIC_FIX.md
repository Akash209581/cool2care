# Render Static Site Configuration

## Problem: "Publish directory npm start does not exist!"

This error occurs when Render is misconfigured for static site deployment.

## ✅ CORRECT Configuration:

### Render Dashboard Settings:
- **Site Type**: Static Site
- **Repository**: Akash209581/cool2care
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist` ← CRITICAL!
- **Auto Deploy**: Yes

### Environment Variables:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## ❌ Common Mistakes:

1. **Wrong Publish Directory**: 
   - ❌ `npm start` 
   - ✅ `dist`

2. **Wrong Build Command**:
   - ❌ `npm start`
   - ✅ `npm run build`

3. **Missing Root Directory**:
   - ❌ Empty or root
   - ✅ `frontend`

## 🔧 Quick Fix Steps:

1. Go to your Render static site
2. Settings → Build & Deploy
3. Change Publish Directory to: `dist`
4. Change Build Command to: `npm run build`
5. Redeploy

## Expected Build Logs (Success):
```
✅ Installing dependencies...
✅ Running npm run build...
✅ Build completed successfully
✅ Publishing from dist/ directory
✅ Deploy successful
```

Your frontend will be live at: `https://your-app.onrender.com`