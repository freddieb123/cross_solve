# Complete Setup Guide

## Prerequisites
- Node.js 16+ installed
- npm or yarn
- Your Neon PostgreSQL database with `clues` table

## Quick Start (Recommended)

### macOS
```bash
./start.sh
```

### Windows
```bash
start.bat
```

### Linux
```bash
bash start.sh
```

This will automatically:
1. Install dependencies if needed
2. Start the backend on `http://localhost:5000`
3. Start the frontend on `http://localhost:3000`

The browser should open automatically, or navigate to `http://localhost:3000`.

---

## Manual Setup (if scripts don't work)

### Step 1: Install Backend
```bash
cd backend
npm install
npm start
```

Output should show:
```
Backend server running on http://localhost:5000
```

### Step 2: Install Frontend (in a NEW terminal)
```bash
cd frontend
npm install
npm start
```

The browser should automatically open to `http://localhost:3000`.

---

## Verifying Everything Works

### ✅ Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{ "status": "ok" }
```

### ✅ Get Available Puzzle Types
```bash
curl http://localhost:5000/api/clues/types
```

Expected response:
```json
{
  "types": ["quick_cryptic", "cryptic", "jumbo", "mephisto"],
  "labels": { ... }
}
```

### ✅ Get a Random Clue
```bash
curl 'http://localhost:5000/api/clues/random?type=quick_cryptic'
```

### ✅ Frontend Running
Navigate to `http://localhost:3000` - you should see:
- Purple gradient header with "Daily Cryptic Trainer"
- Puzzle type selector buttons
- Stats sidebar on the left
- A cryptic clue displayed

---

## Troubleshooting

### Backend won't start
**Error**: `Cannot find module 'pg'`
```bash
cd backend && npm install && npm start
```

**Error**: `connection error`
- Check `.env` has correct `DATABASE_URL`
- Test connection: `npm run test:db` (if available)
- Verify Neon database is online

### Frontend shows blank page
- Open browser console (F12) for errors
- Check `Network` tab in DevTools
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check `frontend/.env` has `REACT_APP_API_URL=http://localhost:5000/api`

### "Failed to load clue" error
- Backend is probably not running
- Check that `http://localhost:5000/api/clues/types` works in curl or browser
- Check backend logs for errors

### Port 3000 or 5000 already in use
**Option 1**: Kill existing process
```bash
# macOS/Linux
lsof -i :3000  # Find process on port 3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Option 2**: Change ports
- Backend: Edit `.env` and change `PORT=5001`
- Frontend: Set `PORT=3001 npm start`
- Update `frontend/.env`: `REACT_APP_API_URL=http://localhost:5001/api`

### Database connection issues
Test connection directly:
```bash
node -e "
require('dotenv').config();
const pool = require('./backend/db.js');
pool.query('SELECT COUNT(*) FROM clues').then(res => {
  console.log('✅ Connected!', res.rows[0].count, 'clues');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
"
```

---

## File Structure for Reference

```
cross_solve/
├── backend/
│   ├── server.js           ← Express app
│   ├── db.js               ← Database pool
│   ├── routes/clues.js     ← API routes
│   ├── utils/puzzleTypes.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/     ← React components
│   │   ├── utils/          ← API & storage
│   │   └── styles/         ← CSS files
│   ├── public/index.html
│   └── package.json
├── .env                    ← Database credentials
├── start.sh / start.bat    ← Run both servers
└── README.md
```

---

## Environment Variables

### Backend (.env in root)
```env
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
PORT=5000
NODE_ENV=development
```

### Frontend (.env in frontend/)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Next Steps

1. ✅ Run the app with `./start.sh` or `start.bat`
2. Select a puzzle type (e.g., "Times Quick Cryptic")
3. Click "Show Hint" to highlight the definition
4. Click letter position buttons to reveal letters
5. Type your answer and press Enter
6. Check your stats in the sidebar

Enjoy improving your cryptic crossword skills! 🎉
