# Daily Cryptic Trainer

A web-based cryptic crossword training tool powered by Times puzzle data.

## Features

- **Multiple puzzle types**: Times Quick Cryptic, Times Cryptic, Jumbo, Mephisto
- **Interactive learning**: Click to reveal letters (randomized for challenge)
- **Hint system**: Highlights the definition part of the clue
- **Answer checking**: Instant feedback with link to original puzzle
- **Progress tracking**: Statistics and history stored locally
- **Responsive design**: Works on desktop and mobile

## Project Structure

```
cross_solve/
├── backend/                 # Node.js/Express API
│   ├── server.js           # Main server entry
│   ├── db.js               # PostgreSQL connection
│   ├── routes/
│   │   └── clues.js        # API endpoints
│   ├── utils/
│   │   └── puzzleTypes.js  # Puzzle type categorization
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/          # API & storage utilities
│   │   ├── styles/         # CSS styling
│   │   ├── App.jsx         # Root component
│   │   └── index.jsx       # Entry point
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env
├── .env                    # Backend config
└── .gitignore
```

## Setup & Installation

### Prerequisites
- Node.js 16+
- PostgreSQL database with `clues` table populated
- Neon database credentials (or update DB connection string)

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Ensure `.env` file exists in root directory with:
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
PORT=5000
```

3. Start the backend server:
```bash
npm start
```

The API will be available at `http://localhost:5000/api`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Ensure `.env` is configured (default `http://localhost:5000/api`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the React development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

### GET `/api/clues/types`
Returns available puzzle types and labels.

**Response:**
```json
{
  "types": ["quick_cryptic", "cryptic", "jumbo", "mephisto"],
  "labels": {
    "quick_cryptic": "Times Quick Cryptic",
    "cryptic": "Times Cryptic",
    "jumbo": "Jumbo",
    "mephisto": "Mephisto"
  }
}
```

### GET `/api/clues/random?type=quick_cryptic`
Get a random clue for the specified puzzle type.

**Query Parameters:**
- `type` (required): One of `quick_cryptic`, `cryptic`, `jumbo`, `mephisto`

**Response:**
```json
{
  "rowid": 123,
  "clue": "Acquisitive chap, as we see it (8)",
  "definition": "Acquisitive",
  "puzzle_name": "Times 27424",
  "puzzle_date": "2019-08-08",
  "source_url": "https://...",
  "answerLength": 8,
  "answerLetterCount": 8
}
```

### POST `/api/clues/check`
Check if the user's answer is correct.

**Request Body:**
```json
{
  "rowid": 123,
  "userAnswer": "COVETOUS"
}
```

**Response:**
```json
{
  "correct": true,
  "answer": "COVETOUS",
  "source_url": "https://..."
}
```

### POST `/api/clues/hint`
Get hint information for a clue (definition highlight).

**Request Body:**
```json
{
  "rowid": 123
}
```

**Response:**
```json
{
  "clue": "Acquisitive chap, as we see it (8)",
  "definition": "Acquisitive",
  "definitionStart": 0,
  "definitionLength": 12
}
```

## Usage

1. **Select Puzzle Type**: Choose from Times Quick Cryptic, Times Cryptic, Jumbo, or Mephisto
2. **Solve the Clue**: Read the cryptic clue and try to answer
3. **Use Hints**: Click "Show Hint" to highlight the definition part of the clue
4. **Reveal Letters**: Click letter position buttons to reveal letters (randomized order)
5. **Submit Answer**: Type your answer and press Enter or click Submit
6. **View Feedback**: See if correct and get a link to the original puzzle
7. **Track Progress**: Check your stats and history in the sidebar

## Storage

- **History**: Stored in browser localStorage (survives page refresh)
- **Stats**: Automatically calculated from history
- **No server-side tracking**: Privacy-first approach

## Customization

### Adding More Puzzle Types

Update `backend/utils/puzzleTypes.js`:

```javascript
function getPuzzleType(puzzleName) {
  const name = puzzleName.toLowerCase();

  if (name.includes('your-pattern')) {
    return 'your_type';
  }
  // ... more conditions
}
```

### Styling

All styles are in `frontend/src/styles/` with CSS variables available at the top of each file for easy customization.

## Troubleshooting

**"Failed to load clue"**
- Ensure backend is running on port 5000
- Check database connection in `.env`
- Verify `clues` table exists with required columns

**CORS errors**
- Backend CORS is configured for `localhost:3000`
- Update `backend/server.js` if running on different port

**No clues for puzzle type**
- Verify puzzle names in database match categorization logic
- Check `backend/utils/puzzleTypes.js` patterns

## Future Enhancements

- [ ] User accounts & cloud sync
- [ ] Spaced repetition algorithm
- [ ] Clue difficulty filtering
- [ ] Solver tips & explanations
- [ ] Leaderboards
- [ ] Dark mode

## License

MIT
