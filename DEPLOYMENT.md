# Deployment Guide - Daily Cryptic Trainer PWA

This guide will help you deploy the Daily Cryptic Trainer as a Progressive Web App (PWA) to Netlify.

## Prerequisites

- Node.js 14+ installed
- GitHub account (or Git repo)
- Netlify account (free tier available)
- PostgreSQL database (local or hosted)

## Local Testing

Before deploying, test the PWA locally:

```bash
# Build the frontend
cd frontend
npm run build

# Test the production build locally
npx serve -s build
```

Then open http://localhost:3000 and test:
- Install as app (browser menu → "Install app" or "Add to Home Screen")
- Works offline (disconnect network)
- All features function correctly

## Deployment to Netlify

### Option 1: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Option 2: Connect GitHub Repository (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cross-solve.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select GitHub
   - Choose your repository
   - Deploy settings should auto-populate (based on netlify.toml)
   - Click "Deploy site"

3. **Configure Environment Variables**
   - Go to Site Settings → Build & Deploy → Environment
   - Add your backend API URL (if needed):
     ```
     REACT_APP_API_URL=https://your-backend-url.com/api
     ```

### Option 3: Manual Deploy

```bash
# Build
cd frontend
npm run build

# Deploy folder
netlify deploy --prod --dir=frontend/build
```

## Environment Variables

If your backend is hosted separately, configure it in Netlify:

1. Site Settings → Build & Deploy → Environment
2. Add environment variables:
   - `REACT_APP_API_URL` = Your backend API URL

Example:
```
REACT_APP_API_URL=https://cryptic-trainer-backend.herokuapp.com/api
```

## Backend Deployment

The backend can be deployed to:
- **Heroku** (free tier)
- **Railway.app**
- **Fly.io**
- **Your own server**

### Deploy Backend to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set DATABASE_URL
heroku config:set DATABASE_URL=your_database_url

# Deploy
git push heroku main
```

## Post-Deployment Testing

After deployment, verify:

1. **PWA Installation**
   - Open on mobile
   - Look for "Install app" prompt
   - Install and test offline functionality

2. **Features**
   - Session creation works
   - Stats are recorded
   - Save for later works
   - Navigation arrows work
   - All modals function

3. **Performance**
   - Check Lighthouse score (DevTools → Lighthouse)
   - Target: 90+ on all categories
   - Fast loading (<3s)

4. **Security**
   - HTTPS enabled (Netlify provides free SSL)
   - Security headers set (via netlify.toml)
   - No console errors

## Custom Domain

1. In Netlify: Site Settings → Domain Management
2. Add custom domain
3. Update DNS records (instructions provided by Netlify)

## Monitoring

### Netlify Analytics
- Site Settings → Analytics
- Monitor deploy previews and site analytics

### Error Tracking
- Site Settings → Logs
- Check function logs and deploy logs

## Troubleshooting

### "Service Worker not registering"
- Check browser console for errors
- Verify service-worker.js is in public folder
- Clear browser cache and reload

### "API requests failing"
- Verify REACT_APP_API_URL is set correctly
- Check CORS is enabled on backend
- Verify backend is running and accessible

### "App not installable"
- Check manifest.json is valid (use Web.dev Manifest Checker)
- Verify HTTPS is enabled
- Check icons are valid

### "Blank page on deploy"
- Check Netlify function logs
- Verify build command succeeds
- Check build folder path is correct

## Continuous Deployment

Changes to `main` branch automatically deploy:

1. Push to GitHub
2. Netlify detects change
3. Runs build command
4. Deploys to production

To test changes first, use **Deploy Previews**:
- Create pull request on GitHub
- Netlify builds preview URL
- Test before merging

## File Structure

```
cross-solve/
├── frontend/                 # React app (Deploy to Netlify)
│   ├── public/
│   │   ├── manifest.json     # PWA manifest
│   │   ├── service-worker.js # Offline support
│   │   └── index.html        # PWA registration
│   ├── src/
│   └── package.json
├── backend/                  # Node.js API (Deploy separately)
│   ├── server.js
│   ├── routes/
│   └── package.json
├── netlify.toml              # Netlify config
└── DEPLOYMENT.md             # This file
```

## Performance Tips

1. **Cache Assets**
   - Static files cached for 1 year (via netlify.toml)
   - Service worker caches on first visit

2. **Minimize API Calls**
   - Stats loaded on demand (not constantly)
   - Saved clues fetched when needed

3. **Image Optimization**
   - Use SVG icons (no file size)
   - No large images in critical path

## Support

For issues:
- Check Netlify docs: https://docs.netlify.com
- Service Worker debugging: https://web.dev/service-workers-cache-storage/
- PWA checklist: https://web.dev/pwa-checklist/
