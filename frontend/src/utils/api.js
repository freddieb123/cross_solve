import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Add Authorization header if token exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ============ Existing Clues API ============

/**
 * Get available puzzle types
 */
export async function getPuzzleTypes() {
  const response = await apiClient.get('/clues/types');
  return response.data;
}

/**
 * Fetch a random clue for a given puzzle type
 */
export async function getRandomClue(puzzleType) {
  const response = await apiClient.get('/clues/random', {
    params: { type: puzzleType },
  });
  return response.data;
}

/**
 * Fetch a specific clue by rowid
 */
export async function getClueByRowid(rowid) {
  const response = await apiClient.get('/clues/by-id', {
    params: { rowid },
  });
  return response.data;
}

/**
 * Check if an answer is correct
 */
export async function checkAnswer(rowid, userAnswer) {
  const response = await apiClient.post('/clues/check', {
    rowid,
    userAnswer,
  });
  return response.data;
}

/**
 * Get hint (definition highlight info)
 */
export async function getHint(rowid) {
  const response = await apiClient.post('/clues/hint', {
    rowid,
  });
  return response.data;
}

/**
 * Get a specific letter from the answer
 */
export async function getLetterHint(rowid, position) {
  const response = await apiClient.post('/clues/letter-hint', {
    rowid,
    position,
  });
  return response.data;
}

// ============ Authentication API ============

/**
 * Register a new user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: {id, email}}>}
 */
export async function register(email, password) {
  const response = await apiClient.post('/auth/register', {
    email,
    password,
  });
  return response.data;
}

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: {id, email}}>}
 */
export async function login(email, password) {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });
  return response.data;
}

/**
 * Get current logged-in user
 * @returns {Promise<{id, username, email}>}
 */
export async function getCurrentUser() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}

/**
 * Logout (clears token from localStorage)
 */
export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

// ============ Stats API ============

/**
 * Record a clue attempt (requires authentication)
 * @param {number} clueRowid
 * @param {number} lettersRevealed
 * @param {number} totalLetters
 * @param {boolean} correct
 * @param {string} puzzleType
 * @returns {Promise<{success: boolean, attemptId: number}>}
 */
export async function recordAttempt(
  clueRowid,
  lettersRevealed,
  totalLetters,
  correct,
  puzzleType
) {
  const response = await apiClient.post('/stats/attempt', {
    clueRowid,
    lettersRevealed,
    totalLetters,
    correct,
    puzzleType,
  });
  return response.data;
}

/**
 * Get stats summary (requires authentication)
 * @returns {Promise<{totalAttempts, correctAnswers, successRate, avgLettersRevealedPct, last10AvgLettersRevealedPct}>}
 */
export async function getStatsSummary() {
  const response = await apiClient.get('/stats/summary');
  return response.data;
}

/**
 * Get stats history (requires authentication)
 * @param {number} limit - Default 50
 * @returns {Promise<Array>}
 */
export async function getStatsHistory(limit = 50) {
  const response = await apiClient.get('/stats/history', {
    params: { limit },
  });
  return response.data;
}

// ============ Saved Clues API ============

/**
 * Save a clue for later (requires authentication)
 * @param {number} clueRowid
 * @returns {Promise<{success: boolean, savedClueId: number}>}
 */
export async function saveClueForLater(clueRowid) {
  const response = await apiClient.post('/saved-clues', {
    clueRowid,
  });
  return response.data;
}

/**
 * Get saved clues (requires authentication)
 * @returns {Promise<Array>}
 */
export async function getSavedClues() {
  const response = await apiClient.get('/saved-clues');
  return response.data;
}

/**
 * Remove a saved clue (requires authentication)
 * @param {number} clueRowid
 * @returns {Promise<{success: boolean}>}
 */
export async function removeSavedClue(clueRowid) {
  const response = await apiClient.delete(`/saved-clues/${clueRowid}`);
  return response.data;
}

// ============ Abbreviations API ============

/**
 * Get all abbreviation quiz entries
 * @returns {Promise<{entries: Array<{meaning: string, abbreviations: string[]}>}>}
 */
export async function getAbbreviations() {
  const response = await apiClient.get('/abbreviations');
  return response.data;
}

export default apiClient;
