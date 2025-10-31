# 🛩️ FLY.IO - Step-by-Step Deployment Guide

## Why Fly.io?
- ✅ **100% FREE** (no trial, no credit card)
- ✅ **Always-on** applications (no sleeping)
- ✅ **Better than Railway** (more reliable)
- ✅ **Global edge locations**

## Step 1: Install Fly CLI

### For Windows (PowerShell):
```powershell
# Run this in PowerShell as Administrator
iwr https://fly.io/install.ps1 -useb | iex
```

### Alternative (Manual):
1. Download from: https://github.com/superfly/flyctl/releases
2. Extract to a folder in your PATH

## Step 2: Login and Setup

```bash
# Login to Fly.io
fly auth login

# Navigate to backend directory
cd "C:\Users\banda\Desktop\my files\cool2care-enhanced-mern\backend"

# Initialize app
fly launch
```

## Step 3: Configure App (when prompted)

**Answer these questions:**
- **App name**: `cool2care-backend` (or let it generate)
- **Region**: Choose closest to you
- **Add PostgreSQL database**: `No` (we use MongoDB Atlas)
- **Add Redis database**: `No`
- **Deploy now**: `No` (we'll set environment variables first)

## Step 4: Set Environment Variables

```bash
# Set all required environment variables
fly secrets set NODE_ENV=production
fly secrets set MONGODB_URI="mongodb+srv://231fa04867_db_user:I7MymzhaClahJEPF@cluster0.gvkjbre.mongodb.net/cool2care?retryWrites=true&w=majority&appName=Cluster0"
fly secrets set JWT_SECRET="cool2care_super_secret_jwt_key_2024_production"
fly secrets set JWT_EXPIRE="7d"
```

## Step 5: Deploy

```bash
# Deploy your application
fly deploy
```

## Step 6: Verify Deployment

```bash
# Check status
fly status

# View logs
fly logs

# Open in browser
fly open
```

## Your app will be live at:
`https://YOUR_APP_NAME.fly.dev`

## Free Tier Includes:
- ✅ **3 shared-cpu-1x VMs** with 256MB RAM each
- ✅ **3GB persistent volume storage**
- ✅ **160GB outbound data transfer/month**
- ✅ **No time limits or sleeping**

Perfect for your Cool2Care application! 🚀