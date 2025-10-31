# 🌐 NETLIFY - Deploy as Serverless Functions

## Why Netlify?
- ✅ **100% FREE** tier
- ✅ **Serverless functions**
- ✅ **Great performance**
- ✅ **Easy setup**

## Step-by-Step:

### Step 1: Create netlify.toml
```toml
[build]
  command = "npm install"
  functions = "functions"
  publish = "."

[functions]
  node_bundler = "nft"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server/:splat"
  status = 200
```

### Step 2: Create serverless function
Create: `backend/functions/server.js`
```javascript
const serverless = require('serverless-http');
const app = require('../server.js');

module.exports.handler = serverless(app);
```

### Step 3: Deploy
1. **Go to**: [netlify.com](https://netlify.com)
2. **Sign up with GitHub**
3. **New site from Git**
4. **Select**: `Akash209581/cool2care`
5. **Build settings**:
   - Base directory: `backend`
   - Build command: `npm install`
   - Publish directory: `.`

### Step 4: Environment Variables
Add in Netlify dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=cool2care_super_secret_jwt_key_2024_production
```

Your API: `https://YOUR_SITE.netlify.app/.netlify/functions/server`