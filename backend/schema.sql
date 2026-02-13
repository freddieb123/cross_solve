-- Users table with authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- User sessions table (legacy, now links to users)
CREATE TABLE IF NOT EXISTS user_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

-- Recreate user_attempts table with user_id (drop old one if it uses session_id)
DROP TABLE IF EXISTS user_attempts CASCADE;
CREATE TABLE user_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clue_rowid INTEGER NOT NULL,
  letters_revealed INTEGER DEFAULT 0,
  total_letters INTEGER NOT NULL,
  correct BOOLEAN NOT NULL,
  puzzle_type VARCHAR(50),
  attempted_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_attempts_user ON user_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_attempts_date ON user_attempts(attempted_at DESC);

-- Recreate saved_clues table with user_id (drop old one if it uses session_id)
DROP TABLE IF EXISTS saved_clues CASCADE;
CREATE TABLE saved_clues (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clue_rowid INTEGER NOT NULL,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, clue_rowid)
);

CREATE INDEX IF NOT EXISTS idx_saved_clues_user ON saved_clues(user_id);

-- Clues table with crossword puzzle clues
CREATE TABLE IF NOT EXISTS clues (
  rowid INTEGER PRIMARY KEY,
  puzzle_name VARCHAR(255),
  puzzle_date VARCHAR(50),
  clue TEXT,
  answer VARCHAR(255),
  definition TEXT,
  source_url VARCHAR(500)
);

CREATE INDEX IF NOT EXISTS idx_clues_puzzle_name ON clues(puzzle_name);
