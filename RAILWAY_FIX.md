# 🚂 Railway Deployment Fix

## Problem
Railway is trying to run `cd backend && npm install` from the root directory, but it should run from inside the backend folder.

## Solution 1: Configure Root Directory (EASIEST)

1. **In Railway Dashboard**:
   - Go to your `cool2care-backend` service
   - Click **"Settings"** tab
   - Find **"Source"** section
   - Set **"Root Directory"** to: `backend`
   - Update **"Build Command"** to: `npm install`
   - Update **"Start Command"** to: `npm start`
   - Click **"Deploy"**

## Solution 2: Create New Service with Correct Setup

1. **Delete current service** (if still failing)
2. **Create new service**:
   - Click **"New Project"** → **"Deploy from GitHub repo"**
   - Select: `Akash209581/cool2care`
   - **Important**: Set **"Root Directory"** to `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## Environment Variables (Don't forget!)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://231fa04867_db_user:I7MymzhaClahJEPF@cluster0.gvkjbre.mongodb.net/cool2care?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=cool2care_super_secret_jwt_key_2024_production
JWT_EXPIRE=7d
```

## Expected Result
✅ Build should show: `npm install` (not `cd backend && npm install`)
✅ Start should show: `npm start`
✅ No "npm: not found" errors

Try Solution 1 first - it's the quickest fix! 🚀