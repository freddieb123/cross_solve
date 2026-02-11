# Netlify Deployment Quick Start

## 5-Minute Deployment

### Step 1: Initialize Git (if not already done)

```bash
cd /Users/fredburgess/Documents/cross_solve
git init
git add .
git commit -m "Initial commit: Daily Cryptic Trainer PWA"
```

### Step 2: Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
2. Name it: `cryptic-trainer` or similar
3. Run:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cryptic-trainer.git
git push -u origin main
```

### Step 3: Connect to Netlify

1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Select GitHub
4. Choose your `cryptic-trainer` repository
5. Build settings should be pre-filled:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
6. Click "Deploy site"

**That's it!** Your PWA is now live. 🎉

## What's Deployed

✅ **Frontend (PWA)**
- Progressive Web App
- Mobile optimized
- Offline support
- Service Worker enabled
- Safe area support for notched devices

❌ **Backend** (requires separate deployment)
- The frontend is deployed to Netlify
- Backend needs to be deployed separately (see Backend Deployment below)

## Backend Deployment

Your frontend needs an API backend. Deploy it to one of:

### Option A: Heroku (Easiest)

```bash
# Install Heroku CLI
npm install -g heroku

# Create Heroku account and login
heroku login

# Create app
heroku create your-app-name

# Add database
heroku addons:create heroku-postgresql:hobby-dev

# Deploy backend
cd backend
git push heroku main
```

Your backend will be at: `https://your-app-name.herokuapp.com`

### Option B: Railway.app

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your cryptic-trainer repo
4. Configure:
   - Build command: `cd backend && npm install`
   - Start command: `node server.js`
5. Add PostgreSQL plugin
6. Deploy

### Option C: Fly.io

1. Install `flyctl`: https://fly.io/docs/getting-started/installing-flyctl/
2. Run: `fly auth login`
3. Deploy:
   ```bash
   cd backend
   fly launch
   fly deploy
   ```

## Configure Frontend to Use Backend

After deploying backend:

1. In Netlify: Go to Site Settings → Build & Deploy → Environment
2. Add new variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.com`

   Examples:
   - Heroku: `https://your-app-name.herokuapp.com`
   - Railway: `https://your-project.up.railway.app`
   - Fly: `https://your-app.fly.dev`

3. Trigger redeploy:
   - In Netlify, go to Deploys → Trigger deploy → Clear cache and redeploy

## Test Your PWA

On mobile:
1. Open your Netlify URL
2. Look for "Install" or "Add to Home Screen" prompt
3. Install the app
4. Use offline
5. Works smoothly!

## Custom Domain

Optional: Add your own domain

1. In Netlify: Site Settings → Domain Management
2. Click "Add custom domain"
3. Follow DNS instructions
4. SSL certificate auto-generated

## Continuous Deployment

Push updates to GitHub → Netlify automatically deploys

```bash
# Make changes
git add .
git commit -m "Updated feature"
git push origin main

# Netlify auto-deploys to production
# Check: Netlify Dashboard → Deploys
```

## PWA Installation Instructions (Share with Users)

### Desktop (Chrome/Edge)
1. Open site in Chrome or Edge
2. Click menu → "Install app"
3. Click "Install"
4. App installed to taskbar

### iPhone/iPad
1. Open Safari
2. Tap Share → Add to Home Screen
3. Name and tap Add
4. App added to home screen

### Android
1. Open Chrome
2. Tap menu → "Install app" (if available)
3. Tap "Install"
4. Or manually: Menu → Add to Home Screen

## Features Your Users Get

✅ **Installable** - Like a native app
✅ **Offline** - Works without internet
✅ **Fast** - Cached assets load instantly
✅ **Mobile** - Optimized for all phones
✅ **Updates** - Always latest version
✅ **Smooth** - No ads or browser UI

## Performance Checklist

After deploying, verify:

1. **Install works** - Open on mobile, test install
2. **Offline works** - Airplane mode, app still functions
3. **Stats load** - Click "Your Stats" → data displays
4. **Save works** - Click 🕐 → clue saves
5. **Navigation** - Arrows and menus work
6. **Speed** - Page loads in <2 seconds

## Troubleshooting

### "Deploy failed"
- Check build logs in Netlify
- Ensure `npm run build` works locally
- Verify all files are committed to Git

### "Backend not responding"
- Verify REACT_APP_API_URL is set correctly
- Check backend is deployed and running
- Test backend URL in browser: `https://your-backend-url.com/api/health`

### "App won't install"
- Ensure HTTPS enabled (Netlify does this by default)
- Check manifest.json is valid
- Try on different browser

### "Service Worker issues"
- Check browser console (F12)
- Clear cache: DevTools → Application → Clear Storage
- Hard refresh (Ctrl+Shift+R)

## Next Steps

1. ✅ Deploy frontend to Netlify
2. ✅ Deploy backend to Heroku/Railway/Fly
3. ✅ Configure REACT_APP_API_URL
4. ✅ Test on mobile
5. ✅ Share with friends!

## Useful Links

- Netlify Docs: https://docs.netlify.com
- PWA Checklist: https://web.dev/pwa-checklist/
- Service Worker: https://web.dev/service-workers-cache-storage/
- Web App Manifest: https://web.dev/add-manifest/

---

**Questions?** Check DEPLOYMENT.md for detailed instructions.
