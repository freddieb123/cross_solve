# Quick Reference Guide

## Running the Application

```bash
# 1. Initialize database (run once or after schema changes)
cd backend && node init-db.js

# 2. Terminal 1 - Start backend
npm run start:backend
# or: cd backend && npm start

# 3. Terminal 2 - Start frontend
npm run start:frontend
# or: cd frontend && npm start

# 4. Open browser
http://localhost:3000
```

## Testing

```bash
# Verify all files are in place
./verify-implementation.sh

# Test backend API endpoints
./test-backend.sh

# Check database tables created
node -e "require('./backend/db').query('\\dt').then(r => console.log(r.rows))"
```

## Key Files Quick Access

### Backend Routes
- Stats: `backend/routes/stats.js` (7 functions)
- Saved: `backend/routes/savedClues.js` (3 functions)

### Frontend Components
- Menu: `frontend/src/components/BurgerMenu.jsx`
- Stats: `frontend/src/components/StatsModal.jsx`
- Saved: `frontend/src/components/SavedCluesModal.jsx`

### Core Files
- App: `frontend/src/App.jsx`
- Clue Display: `frontend/src/components/ClueDisplay.jsx`
- Session: `frontend/src/utils/session.js`
- API: `frontend/src/utils/api.js`

## API Endpoints

```
POST   /api/stats/session              - Create/retrieve session
POST   /api/stats/attempt              - Record attempt
GET    /api/stats/summary/:sessionId   - Get stats
GET    /api/stats/history/:sessionId   - Get attempt history
POST   /api/saved-clues                - Save clue
GET    /api/saved-clues/:sessionId     - List saved
DELETE /api/saved-clues/:sid/:rowid    - Delete saved
```

## Database Tables

```sql
user_sessions     -- UUID, created_at, last_active
user_attempts     -- session_id, clue_rowid, letters_revealed, correct
saved_clues       -- session_id, clue_rowid, saved_at
```

## localStorage Key

```javascript
// Session ID stored here
localStorage.getItem('cryptic_session_id')  // Returns UUID
```

## Component Props

### BurgerMenu
```jsx
<BurgerMenu
  onSelectType={callback}
  onShowStats={callback}
  onShowSavedClues={callback}
/>
```

### StatsModal
```jsx
<StatsModal
  sessionId={uuid}
  onClose={callback}
/>
```

### SavedCluesModal
```jsx
<SavedCluesModal
  sessionId={uuid}
  onClose={callback}
  onLoadClue={callback}
/>
```

### ClueDisplay (updated)
```jsx
<ClueDisplay
  puzzleType={type}
  sessionId={uuid}
  loadedClue={clueObject}
  onClueChange={callback}
/>
```

## Common Tasks

### Clear Session (for testing)
```javascript
localStorage.removeItem('cryptic_session_id');
location.reload();
```

### Check Session UUID
```javascript
console.log(localStorage.getItem('cryptic_session_id'));
```

### Test Save for Later
1. Solve a clue
2. Click 🕐 Save button
3. See green notification
4. Open menu → Saved for Later
5. Clue appears in list

### Test Stats
1. Solve clue with letter reveals
2. Open menu → Your Stats
3. See attempt in history with % letters

### Mobile Testing
```
Chrome DevTools → Toggle device toolbar → Select device
Firefox DevTools → Responsive Design Mode
```

## Error Checking

### No stats showing?
- Check if backend is running (port 5000)
- Check browser console for errors
- Verify database initialized: `node backend/init-db.js`

### Menu not appearing?
- Make sure you're past type selector screen
- Check sessionId is created: `localStorage.getItem('cryptic_session_id')`

### Saved clues not loading?
- Check network tab in DevTools
- Verify GET /api/saved-clues/:sessionId returns data
- Check database has entries: `SELECT * FROM saved_clues;`

### Styling looks wrong?
- Clear browser cache (Ctrl+Shift+Delete)
- Hard reload page (Ctrl+Shift+R)
- Check CSS files exist in styles/ folder

## Performance Tips

- Stats modal lazy-loads data when opened
- Saved clues fetched on demand
- Database queries indexed for speed
- CSS animations run at 60fps

## Mobile Optimization

- Hamburger menu perfect for small screens
- Touch-friendly 44x44px buttons
- Modals fit in viewport
- Answer grid responsive
- No horizontal scrolling

## Deployment Notes

1. Make sure DATABASE_URL env var is set
2. Run `node backend/init-db.js` on first deploy
3. Frontend builds with `npm run build` in frontend dir
4. Backend runs with `npm start` in backend dir
5. CORS already enabled for localhost (may need update for production)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 12+, Android Chrome 90+)

## Monitoring

### Backend Health
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

### Check Tables
```sql
SELECT COUNT(*) FROM user_sessions;
SELECT COUNT(*) FROM user_attempts;
SELECT COUNT(*) FROM saved_clues;
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Button unresponsive | Check sessionId initialized |
| Stats not showing | Verify backend running, DB initialized |
| Menu doesn't appear | Must be past type selector screen |
| Saved clues empty | Click 🕐 Save on a clue first |
| Mobile layout broken | Check CSS files loaded (DevTools) |
| Session lost after refresh | localStorage key may be deleted |
| API 404 errors | Check backend routes imported in server.js |

## Documentation Files

- `IMPLEMENTATION_SUMMARY.md` - Full feature guide
- `TESTING_CHECKLIST.md` - Step-by-step testing
- `QUICK_REFERENCE.md` - This file
- `README.md` - Original project readme

## Support

1. Check console for errors (F12)
2. Check backend terminal for API errors
3. Use test-backend.sh to verify endpoints
4. Review TESTING_CHECKLIST.md
5. Check localStorage values
6. Verify database tables exist
