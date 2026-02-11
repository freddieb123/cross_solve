# Daily Cryptic API Documentation

Base URL: `http://localhost:5000/api`

All responses are JSON. Timestamps are ISO 8601 format.

---

## Health Check

### GET `/health`

Simple health check endpoint.

**Response:**
```json
{ "status": "ok" }
```

**Status Code:** 200 OK

---

## Puzzle Types

### GET `/clues/types`

Get all available puzzle types and their labels.

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

**Status Code:** 200 OK

---

## Clues

### GET `/clues/random`

Get a random clue for a specified puzzle type.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | One of: `quick_cryptic`, `cryptic`, `jumbo`, `mephisto` |

**Example Request:**
```
GET /clues/random?type=quick_cryptic
```

**Response:**
```json
{
  "rowid": 42,
  "clue": "Acquisitive chap, as we see it (8)",
  "definition": "Acquisitive",
  "puzzle_name": "Times 27424",
  "puzzle_date": "2019-08-08",
  "source_url": "https://times-xwd-times.livejournal.com/2185818.html",
  "answerLength": 8,
  "answerLetterCount": 8
}
```

**Status Codes:**
- `200 OK` - Clue found
- `400 Bad Request` - Invalid puzzle type
- `404 Not Found` - No clues available for type

**Note:** The `answer` field is intentionally excluded. Use the `/check` endpoint to verify answers.

---

### POST `/clues/check`

Verify if a user's answer is correct.

**Request Body:**
```json
{
  "rowid": 42,
  "userAnswer": "COVETOUS"
}
```

**Response (Correct):**
```json
{
  "correct": true,
  "answer": "COVETOUS",
  "source_url": "https://times-xwd-times.livejournal.com/2185818.html"
}
```

**Response (Incorrect):**
```json
{
  "correct": false,
  "answer": "COVETOUS",
  "source_url": "https://times-xwd-times.livejournal.com/2185818.html"
}
```

**Status Codes:**
- `200 OK` - Answer checked
- `400 Bad Request` - Missing `rowid` or `userAnswer`
- `404 Not Found` - Clue not found

**Note:** Answer comparison is case-insensitive.

---

### POST `/clues/hint`

Get hint information for a clue (definition highlight).

**Request Body:**
```json
{
  "rowid": 42
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

**How to Use:**
- `definitionStart`: Character index where definition begins in the clue
- `definitionLength`: Number of characters in the definition
- Use these to highlight: `clue.substring(definitionStart, definitionStart + definitionLength)`

**Status Codes:**
- `200 OK` - Hint retrieved
- `400 Bad Request` - Missing `rowid`
- `404 Not Found` - Clue not found

---

### POST `/clues/letter-hint`

Get a specific letter from the answer at a given position.

**Request Body:**
```json
{
  "rowid": 42,
  "position": 0
}
```

**Response:**
```json
{
  "position": 0,
  "letter": "C"
}
```

**Status Codes:**
- `200 OK` - Letter retrieved
- `400 Bad Request` - Invalid position or missing parameters
- `404 Not Found` - Clue not found

**Note:**
- Positions are 0-indexed (first letter = position 0)
- Spaces in answers are returned as `" "`
- Letters are always returned in uppercase

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Error Codes:**
- `400 Bad Request` - Invalid parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error (check logs)

---

## Rate Limiting

No rate limiting currently implemented. In production, consider adding:
- Per-IP rate limiting
- Rate limiting per user session
- Caching for frequently accessed endpoints

---

## Data Types

### Puzzle Type
```typescript
type PuzzleType = 'quick_cryptic' | 'cryptic' | 'jumbo' | 'mephisto'
```

### Clue Object
```typescript
interface Clue {
  rowid: number              // Unique ID in database
  clue: string               // The cryptic clue text
  definition: string         // The straight definition part
  puzzle_name: string        // e.g., "Times 27424" or "Quick Cryptic 282"
  puzzle_date: string        // Date in YYYY-MM-DD format
  source_url: string         // Link to original puzzle
  answerLength: number       // Total characters including spaces
  answerLetterCount: number  // Count of actual letters (excluding spaces)
}
```

---

## Integration Examples

### JavaScript/Node.js
```javascript
import axios from 'axios';

const API = 'http://localhost:5000/api';

// Get random clue
const clue = await axios.get(`${API}/clues/random?type=quick_cryptic`);

// Check answer
const result = await axios.post(`${API}/clues/check`, {
  rowid: clue.data.rowid,
  userAnswer: 'COVETOUS'
});

console.log(result.data.correct); // true or false
```

### cURL
```bash
# Get random clue
curl -X GET 'http://localhost:5000/api/clues/random?type=quick_cryptic'

# Check answer
curl -X POST 'http://localhost:5000/api/clues/check' \
  -H 'Content-Type: application/json' \
  -d '{
    "rowid": 42,
    "userAnswer": "COVETOUS"
  }'

# Get letter hint
curl -X POST 'http://localhost:5000/api/clues/letter-hint' \
  -H 'Content-Type: application/json' \
  -d '{
    "rowid": 42,
    "position": 0
  }'
```

### Python
```python
import requests

API = 'http://localhost:5000/api'

# Get random clue
response = requests.get(f'{API}/clues/random', params={'type': 'quick_cryptic'})
clue = response.json()

# Check answer
result = requests.post(f'{API}/clues/check', json={
    'rowid': clue['rowid'],
    'userAnswer': 'COVETOUS'
})

print(result.json()['correct'])
```

---

## CORS Policy

By default, the API allows requests from `localhost:3000`. To allow other origins, update `backend/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://your-domain.com']
}));
```

---

## Database Schema

The API queries against a `clues` table with these columns:
- `rowid` (INTEGER, PRIMARY KEY)
- `clue` (TEXT)
- `answer` (TEXT)
- `definition` (TEXT)
- `clue_number` (TEXT) - e.g., "1a", "5d"
- `puzzle_name` (TEXT)
- `puzzle_date` (TEXT)
- `source_url` (TEXT)
- `source` (TEXT) - Currently: "times_xwd_times"

---

## Future Enhancements

- [ ] User authentication & cloud sync
- [ ] Difficulty filtering
- [ ] Time-based hints
- [ ] Solver statistics per puzzle type
- [ ] Difficulty rating from community
