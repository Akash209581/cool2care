# 🛩️ Fly.io - 100% FREE Alternative

Fly.io offers completely free hosting for small applications!

## Why Fly.io?
- ✅ **100% FREE** (no trial, no credit card)
- ✅ **Always-on** applications
- ✅ **Reliable** build system
- ✅ **Easy deployment**

## Quick Setup:

### 1. Install Fly CLI
```powershell
# Install via PowerShell
iwr https://fly.io/install.ps1 -useb | iex
```

### 2. Login and Setup
```bash
fly auth login
cd backend
fly launch
```

### 3. Configure (when prompted)
- **App name**: `cool2care-backend`
- **Region**: Choose closest
- **Add database**: No (we have MongoDB Atlas)

### 4. Set Environment Variables
```bash
fly secrets set NODE_ENV=production
fly secrets set MONGODB_URI="mongodb+srv://231fa04867_db_user:I7MymzhaClahJEPF@cluster0.gvkjbre.mongodb.net/cool2care?retryWrites=true&w=majority&appName=Cluster0"
fly secrets set JWT_SECRET="cool2care_super_secret_jwt_key_2024_production"
fly secrets set JWT_EXPIRE="7d"
```

### 5. Deploy
```bash
fly deploy
```

## Free Tier Limits:
- ✅ **3 shared-cpu-1x VMs** with 256MB RAM
- ✅ **3GB persistent volume storage**
- ✅ **160GB outbound data transfer**
- ✅ **No time limits**

Perfect for your Cool2Care application! 🚀