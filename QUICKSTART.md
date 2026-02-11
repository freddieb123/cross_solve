# Quick Start

## 1. Start Backend

```bash
cd backend
npm install  # First time only
npm start
```

Backend runs at `http://localhost:5000`

## 2. Start Frontend (in new terminal)

```bash
cd frontend
npm install  # First time only
npm start
```

Frontend runs at `http://localhost:3000`

## 3. Done!

Open browser to `http://localhost:3000` and start solving cryptic clues.

## Data Flow

```
User Browser
    ↓
React Frontend (localhost:3000)
    ↓ (Axios HTTP requests)
Express API (localhost:5000)
    ↓
PostgreSQL Database (Neon)
    ↓
Clues Table (101K+ cryptic clues)
```

## Troubleshooting

**Backend won't start?**
```bash
# Check .env has valid DATABASE_URL
# Verify Neon database is accessible
```

**Frontend can't reach API?**
```bash
# Ensure backend is running on port 5000
# Check frontend/.env has correct REACT_APP_API_URL
```

**No clues loading?**
```bash
# Check backend logs for database errors
# Verify clues table has data: SELECT COUNT(*) FROM clues;
```
