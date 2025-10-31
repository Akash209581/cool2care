# 🆓 FREE Deployment Guide - Railway + Vercel

Your Cool2Care app will be deployed **100% FREE** using:
- **Backend**: Railway ($5 monthly credits - more than enough!)
- **Frontend**: Vercel (Free forever)
- **Database**: MongoDB Atlas (Free tier)

## 🚂 Step 1: Deploy Backend to Railway

### Setup Railway:
1. **Go to**: [railway.app](https://railway.app)
2. **Sign up** with GitHub account
3. **Click "Deploy from GitHub repo"**
4. **Select repository**: `Akash209581/cool2care`

### Configure Railway:
1. **Service Name**: `cool2care-backend`
2. **Root Directory**: `/backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

### Environment Variables for Railway:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://231fa04867_db_user:I7MymzhaClahJEPF@cluster0.gvkjbre.mongodb.net/cool2care?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=cool2care_super_secret_jwt_key_2024_production
JWT_EXPIRE=7d
```

## ▲ Step 2: Deploy Frontend to Vercel

### Setup Vercel:
1. **Go to**: [vercel.com](https://vercel.com)
2. **Sign up** with GitHub account
3. **Click "New Project"**
4. **Import**: `Akash209581/cool2care`

### Configure Vercel:
1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Environment Variables for Vercel:
```
VITE_API_URL=https://YOUR_RAILWAY_BACKEND_URL
```

## 🔗 Step 3: Connect Services

After both deployments:
1. **Copy Railway backend URL** (e.g., `https://cool2care-backend-production.up.railway.app`)
2. **Update Vercel environment variable**: `VITE_API_URL` with Railway URL
3. **Redeploy frontend** on Vercel

## 📊 Free Tier Limits:

### Railway:
- ✅ **$5 monthly credits** (enough for small apps)
- ✅ **No time limits**
- ✅ **Always-on services**

### Vercel:
- ✅ **100GB bandwidth/month**
- ✅ **Unlimited deployments**
- ✅ **Custom domains**

### MongoDB Atlas:
- ✅ **512MB storage**
- ✅ **Shared cluster**
- ✅ **No time limits**

## 🎯 Total Monthly Cost: $0

Your entire application will run completely free with these generous limits!

## 🚀 Quick Start:

1. **Railway**: Deploy backend (5 minutes)
2. **Vercel**: Deploy frontend (3 minutes)
3. **Connect**: Update environment variables (2 minutes)

**Total setup time: ~10 minutes**

Let's get started! 🎉