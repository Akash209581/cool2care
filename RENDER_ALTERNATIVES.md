# Alternative Deployment Guide for Cool2Care

## 🚨 Important: Render Free Tier Changes

Render has discontinued free web services. Here are your options:

### Option 1: Manual Deployment (Recommended)

Instead of using the Blueprint (render.yaml), deploy manually:

#### Deploy Backend:
1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
2. **Click "New" → "Web Service"**
3. **Connect Repository**: `https://github.com/Akash209581/cool2care.git`
4. **Configure**:
   - **Name**: `cool2care-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Starter ($7/month) or use 14-day free trial

#### Deploy Frontend:
1. **Click "New" → "Static Site"**
2. **Connect Same Repository**
3. **Configure**:
   - **Name**: `cool2care-frontend` 
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free (static sites are still free!)

#### Environment Variables:
**Backend**:
```
MONGODB_URI=mongodb+srv://231fa04867_db_user:I7MymzhaClahJEPF@cluster0.gvkjbre.mongodb.net/cool2care?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=cool2care_super_secret_jwt_key_2024_production
NODE_ENV=production
PORT=10000
```

**Frontend**:
```
VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com
```

### Option 2: Alternative Free Platforms

Since Render no longer offers free web services, consider these alternatives:

#### Railway (Free Tier Available):
- **Website**: [railway.app](https://railway.app)
- **Free Tier**: $5 credit monthly
- **Pros**: Similar to Render, easy deployment

#### Vercel (Free for Frontend):
- **Website**: [vercel.com](https://vercel.com)
- **Free**: Frontend hosting
- **Backend**: Use Railway or other service

#### Netlify (Free for Frontend):
- **Website**: [netlify.com](https://netlify.com)
- **Free**: Frontend hosting
- **Backend**: Use Railway or other service

### Option 3: Use Render's Free Trial

- **14-day free trial** for web services
- Perfect for testing your deployment
- Can upgrade or migrate later

## 💡 Recommendation

For immediate deployment:
1. **Use Render's 14-day free trial** for the backend
2. **Deploy frontend for free** as a static site
3. **Total cost**: $0 for 14 days, then $7/month for backend

This gives you time to test everything and decide if you want to continue with Render or migrate to Railway/other platforms.

Would you like me to help you with any of these options?