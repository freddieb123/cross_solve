# Deploy Daily Cryptic Trainer to Mobile - Complete Guide

This guide will get your app deployed and working on your phone in about 30 minutes.

## Overview

You'll deploy:
1. **Frontend** (React PWA) → Netlify (free, automatic HTTPS)
2. **Backend** (Node.js API + PostgreSQL) → Railway.app (free tier available, easy PostgreSQL setup)

## Prerequisites

- GitHub account (https://github.com)
- Netlify account (https://netlify.com) - sign up with GitHub
- Railway account (https://railway.app) - sign up with GitHub

---

## PART 1: Set Up Git Repository

### Step 1.1: Initialize Git Locally

```bash
cd /Users/fredburgess/Documents/cross_solve
git init
git add .
git commit -m "Initial commit: Daily Cryptic Trainer with email auth"
```

### Step 1.2: Create GitHub Repository

1. Go to https://github.com/new
2. Create repository:
   - **Name**: `cryptic-trainer` (or any name)
   - **Description**: "Daily Cryptic Crossword Trainer - PWA"
   - **Public** (required for free Netlify/Railway)
   - Click "Create repository"

### Step 1.3: Push to GitHub

After creating the repo, GitHub shows you the commands. Run these:

```bash
cd /Users/fredburgess/Documents/cross_solve
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cryptic-trainer.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**Verify**: Go to your GitHub repo URL and see all files uploaded ✓

---

## PART 2: Deploy Backend to Railway.app

### Step 2.1: Create Railway.app Account

1. Go to https://railway.app
2. Click "Start New Project"
3. Sign in with GitHub
4. Authorize Railway to access your GitHub

### Step 2.2: Create Backend Project

1. Click "Deploy from GitHub"
2. Select your `cryptic-trainer` repository
3. Railway asks to configure:
   - When it says "Select a template", click "Skip"
   - It will ask which folder to deploy - select **`backend`**

### Step 2.3: Add PostgreSQL Database

1. In Railway dashboard, you should see your project
2. Click the "+" icon or "Add Plugin"
3. Search for "PostgreSQL"
4. Click "PostgreSQL" → Select it
5. It installs automatically

### Step 2.4: Configure Environment Variables

1. Click on the **PostgreSQL** service in Railway
2. Click "Variables" tab
3. Copy the `DATABASE_URL` value (full connection string)
4. Click on your **Node.js** service
5. Click "Variables" tab
6. Add these variables:
   - **Key**: `JWT_SECRET`
   - **Value**: Generate a random string (e.g., `your-super-secret-key-12345`)

   Add another:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the PostgreSQL connection string you copied

### Step 2.5: Deploy Backend

1. Railway auto-deploys when you push to GitHub
2. Wait for green checkmark ✓
3. In the Node.js service, click the "Public URL" - this is your backend URL

**Write down your backend URL**, it looks like:
```
https://cryptic-trainer-prod-xyz.up.railway.app
```

---

## PART 3: Deploy Frontend to Netlify

### Step 3.1: Connect Netlify to GitHub

1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Click "GitHub"
4. Authorize Netlify
5. Select your `cryptic-trainer` repository

### Step 3.2: Configure Build Settings

Netlify shows build settings. Enter:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/build`

### Step 3.3: Add Environment Variables

**Important**: Before deploying, add your backend URL.

1. Click "Environment" or "Build & Deploy → Environment"
2. Click "Edit variables"
3. Add:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your Railway backend URL from Step 2.5

   Example: `https://cryptic-trainer-prod-xyz.up.railway.app`

4. Click "Save"

### Step 3.4: Deploy

1. Click "Deploy" button
2. Netlify builds and deploys (takes 2-3 minutes)
3. When done, you get a URL like: `https://cryptic-trainer-abc123.netlify.app`

**Write down your frontend URL** ✓

---

## PART 4: Initialize Backend Database

The backend is deployed but the database is empty. You need to run the initialization script.

### Step 4.1: Connect to Railway PostgreSQL

1. In Railway dashboard, click your PostgreSQL service
2. Click "Connect" tab
3. You'll see the connection details

### Step 4.2: Create Database Tables

You have two options:

**Option A: Using Railway's PostgreSQL Client (Easiest)**

1. In Railway, go to PostgreSQL service
2. Click "Data" tab
3. Click the SQL editor icon
4. Copy-paste the contents of `backend/schema.sql`
5. Execute

**Option B: Using Command Line (Advanced)**

```bash
# Install PostgreSQL client if needed
brew install postgresql

# Connect to your Railway database using the connection string
psql "postgresql://user:password@host:port/dbname"

# Then run:
\i /path/to/backend/schema.sql
```

**Verify**: Database tables created ✓

---

## PART 5: Test on Mobile

### Step 5.1: Open on Mobile Browser

1. On your phone, open the Netlify URL from Step 3.4
   - Example: `https://cryptic-trainer-abc123.netlify.app`
2. The app loads in your browser

### Step 5.2: Test Authentication

1. **Create Account**:
   - Click "Create one" link
   - Email: `test@example.com`
   - Password: `password123`
   - Click "Create Account"
   - Should redirect to puzzle selector ✓

2. **Select Puzzle Type**:
   - Choose "Cryptic" or another type
   - Clue loads ✓

3. **Test Stats**:
   - Solve a clue (or skip)
   - Open burger menu (☰)
   - Click "Your Stats" - should show 0 attempts (first time)
   - Stats from database ✓

### Step 5.3: Install as PWA (Make it a "Native" App)

**On iPhone/iPad**:
1. In Safari: Tap Share icon → Scroll down → "Add to Home Screen"
2. Name it "Cryptic Trainer"
3. Tap "Add"
4. Icon appears on home screen ✓
5. Tap it to launch - looks like a real app!

**On Android**:
1. In Chrome: Tap menu (⋮) → "Install app"
2. Or: Menu → "Add to Home Screen"
3. Icon appears on home screen ✓

---

## PART 6: Update Backend URL if Needed

If your backend URL changes (Railway sometimes rotates them), update it:

1. In Netlify dashboard
2. Site Settings → Build & Deploy → Environment variables
3. Edit `REACT_APP_API_URL`
4. Click "Trigger deploy" to redeploy

---

## Troubleshooting

### "Backend not connecting"
- Check the backend URL is correct in Netlify environment variables
- Test by opening the URL in browser: `https://your-backend-url/api/health`
- Should return: `{"status":"ok"}`

### "Database connection error"
- Verify `DATABASE_URL` is set in Railway backend service
- Run schema.sql to create tables
- Check PostgreSQL service is running in Railway

### "Can't create account"
- Check browser console (F12 → Console)
- Look for error messages
- Verify backend is deployed and database initialized

### "App won't install on home screen"
- Must use HTTPS (Netlify/Railway do this automatically)
- Try different browser
- Close browser cache (Settings → Clear browsing data)

### "Offline doesn't work"
- First visit must be online (to cache files)
- Service Worker takes 30 seconds to install
- Try airplane mode after using app online for 1 minute

---

## Making Updates

Every time you update the code:

```bash
# In your project root
git add .
git commit -m "Your update message"
git push origin main

# Both Netlify and Railway auto-deploy!
# Check their dashboards for progress
```

---

## Success Checklist

- [ ] GitHub repository created and code pushed
- [ ] Railway backend deployed with PostgreSQL
- [ ] Database initialized with schema.sql
- [ ] Netlify frontend deployed with REACT_APP_API_URL set
- [ ] Backend health check works (api/health endpoint)
- [ ] Can create account from mobile browser
- [ ] Can login with email
- [ ] Stats page loads data
- [ ] App installed on home screen
- [ ] App works offline

---

## Next Steps

1. Test on mobile ✓
2. Create more accounts to test
3. Solve clues and track stats
4. Share the Netlify URL with friends
5. Make code improvements → auto-deploy

Enjoy your deployed app! 🎉

---

## Quick Reference Links

- Your Frontend: `https://cryptic-trainer-abc123.netlify.app`
- Your Backend: `https://cryptic-trainer-prod-xyz.up.railway.app`
- Netlify Dashboard: https://app.netlify.com
- Railway Dashboard: https://railway.app
- GitHub Repo: https://github.com/YOUR_USERNAME/cryptic-trainer
