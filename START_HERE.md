# 🎯 START HERE

## Ready to Launch? (< 5 minutes)

### For macOS/Linux Users
```bash
./start.sh
```

### For Windows Users
```bash
start.bat
```

**That's it!** The app will open in your browser at `http://localhost:3000`

---

## What Happens Automatically

1. ✅ Installs dependencies (if needed)
2. ✅ Starts backend API on `localhost:5000`
3. ✅ Starts React app on `localhost:3000`
4. ✅ Opens browser automatically

---

## If Scripts Don't Work

**Option A: Manual Start (Recommended)**
```bash
# Terminal 1 - Backend
cd backend && npm install && npm start

# Terminal 2 - Frontend
cd frontend && npm install && npm start
```

**Option B: Using npm scripts**
```bash
npm run start:backend    # Terminal 1
npm run start:frontend   # Terminal 2
```

---

## First Time Using?

1. **Load the app**: Navigate to `http://localhost:3000`
2. **Pick a puzzle type**: Click "Times Quick Cryptic" (easiest)
3. **Read the clue**: Top section shows the cryptic clue
4. **Get hints**:
   - Click "Show Hint" for definition highlighting
   - Click letter buttons (1, 2, 3...) to reveal letters
5. **Solve**: Type your answer and press Enter
6. **See result**: Get feedback + link to original puzzle

---

## Verify Everything Works

```bash
npm run test:setup
```

Should show:
- ✅ Backend Health Check
- ✅ Frontend Server
- ✅ Database connected

---

## Quick Reference

| Need | Do This |
|------|---------|
| Run app | `./start.sh` or `start.bat` |
| Stop app | Press `Ctrl+C` in terminal |
| Check if working | `npm run test:setup` |
| Backend only | `npm run start:backend` |
| Frontend only | `npm run start:frontend` |
| View API docs | Read `API.md` |
| Setup help | Read `SETUP.md` |
| Detailed guide | Read `README.md` |
| Project overview | Read `PROJECT_SUMMARY.md` |

---

## What You Get

✨ **Out of the box:**
- 101,240 Times cryptic clues
- 4 puzzle types (Quick Cryptic → Mephisto)
- Random clue selector
- Letter revealing system
- Definition hints
- Stats & history tracking
- Mobile-responsive design
- Zero login required

---

## File Structure (For Reference)

```
cross_solve/
├── backend/          ← Express API
├── frontend/         ← React app
├── start.sh          ← Run this (macOS/Linux)
├── start.bat         ← Run this (Windows)
├── SETUP.md          ← Detailed setup
├── API.md            ← API reference
└── README.md         ← Full documentation
```

---

## Common Issues

**Backend won't start?**
```bash
cd backend && npm install
```

**Port already in use?**
```bash
lsof -i :3000  # Find what's using port 3000
kill -9 <PID>   # Kill it
```

**Can't connect to database?**
- Check `.env` has valid `DATABASE_URL`
- Verify Neon database is online
- Test: `npm run test:setup`

**Frontend shows blank page?**
- Open browser console (F12)
- Check Network tab for errors
- Ensure backend is running

---

## Next Steps

1. ✅ **Launch**: `./start.sh` or `start.bat`
2. ✅ **Solve**: Try a few clues to get the hang of it
3. ✅ **Check stats**: See your progress in sidebar
4. ✅ **Review code**: Everything is well-commented
5. ✅ **Customize**: Change colors, add features, etc.

---

## Want to Learn More?

- 📖 **Setup guide**: `SETUP.md`
- 🔌 **API reference**: `API.md`
- 📚 **Full documentation**: `README.md`
- 🎯 **Project overview**: `PROJECT_SUMMARY.md`

---

## Quick Commands

```bash
# Run everything
./start.sh

# Just backend
npm run start:backend

# Just frontend
npm run start:frontend

# Verify setup
npm run test:setup

# Clear browser data
# Open DevTools (F12) → Console, then:
# localStorage.clear()
```

---

## Got Stuck?

1. Check `SETUP.md` for troubleshooting
2. Verify with `npm run test:setup`
3. Check browser console (F12)
4. Ensure both backend and frontend are running
5. Try clearing browser cache (Ctrl+Shift+Delete)

---

## Ready? 🚀

Run this now:

```bash
./start.sh
```

**Or on Windows:**
```bash
start.bat
```

Then go to `http://localhost:3000` and start solving!

---

**Enjoy! 🎯**
