# 🚀 Quick Deployment Script

This document provides copy-paste commands for quick deployment.

## Prerequisites

```bash
# Install Git (if not already installed)
# Download from: https://git-scm.com/downloads

# Verify Git installation
git --version
```

## Step 1: Configure Git (First Time Only)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Initialize Git Repository

```bash
# Navigate to your project
cd "c:\Users\Ahsan\Downloads\Web Programming Project"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Smart Hospital System ready for deployment"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `smart-hospital-system`
3. **DO NOT** initialize with README, .gitignore, or license
4. Click "Create repository"

## Step 4: Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/smart-hospital-system.git

# Push code
git branch -M main
git push -u origin main
```

## Step 5: Deploy Database (Railway)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision MySQL"
4. Save these credentials from "Variables" tab:
   - MYSQL_HOST
   - MYSQL_PORT
   - MYSQL_USER
   - MYSQL_PASSWORD
   - MYSQL_DATABASE

## Step 6: Deploy Backend (Render)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your `smart-hospital-system` repository
5. Configure:
   - **Name**: `smart-hospital-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. Add Environment Variables (click "Environment"):
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<paste Railway MySQL Host>
   DB_PORT=<paste Railway MySQL Port>
   DB_USER=<paste Railway MySQL User>
   DB_PASSWORD=<paste Railway MySQL Password>
   DB_NAME=<paste Railway MySQL Database>
   JWT_SECRET=my-super-secret-jwt-key-change-this-to-something-random-and-secure
   FRONTEND_URL=<will add after frontend deployment>
   ```

7. Click "Create Web Service"
8. **Save your backend URL**: `https://smart-hospital-backend.onrender.com`

## Step 7: Update Backend with Frontend URL

After frontend is deployed, go back to Render backend:
1. Go to "Environment" tab
2. Update `FRONTEND_URL` variable with your frontend URL
3. Save changes (will auto-redeploy)

## Step 8: Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your `smart-hospital-system` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variable:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://smart-hospital-backend.onrender.com
     ```
     (Use your actual backend URL from Step 6)

7. Click "Deploy"
8. **Save your frontend URL**: `https://smart-hospital-system.vercel.app`

## Step 9: Test Your Deployment

1. Visit your frontend URL
2. Test registration
3. Test login
4. Test all features

## 🎉 You're Live!

Your Smart Hospital System is now deployed:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: Railway MySQL

---

## Alternative: All-in-One Railway Deployment

If you prefer everything in one place:

1. Go to https://railway.app
2. Create "New Project"
3. Add MySQL database
4. Add service from GitHub repo (for backend)
   - Root Directory: `backend`
   - Start Command: `npm start`
5. Add another service from same repo (for frontend)
   - Build Command: `npm install && npm run build`
   - Start Command: `npx vite preview --host 0.0.0.0 --port $PORT`
6. Generate domains for both services
7. Update environment variables accordingly

---

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure database is running

### Frontend shows connection error
- Verify `VITE_API_URL` is correct
- Check browser console for actual URL being used
- Ensure backend is running

### Database connection fails
- Verify Railway database is running
- Check environment variables match exactly
- Ensure no extra spaces in credentials

### Git commit fails
- Configure Git identity first:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

---

## Need Help?

Refer to the main [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
