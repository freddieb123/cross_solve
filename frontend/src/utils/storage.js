/**
 * localStorage management for completed clues and stats
 */

const STORAGE_KEY_HISTORY = 'cryptic_history';
const STORAGE_KEY_STATS = 'cryptic_stats';

/**
 * Add a clue to history
 * history item: { rowid, clue, answer, puzzleName, puzzleDate, attempted, correct, timestamp }
 */
export function addToHistory(clueData, correct) {
  const history = getHistory();
  history.push({
    rowid: clueData.rowid,
    clue: clueData.clue,
    answer: clueData.answer,
    puzzleName: clueData.puzzle_name,
    puzzleDate: clueData.puzzle_date,
    attempted: true,
    correct,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  updateStats(correct);
}

/**
 * Get all clues from history
 */
export function getHistory() {
  const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get history for a specific puzzle type
 */
export function getHistoryByType(puzzleType) {
  const history = getHistory();
  // Note: we'd need to store puzzle type in history to filter
  return history;
}

/**
 * Update stats after each attempt
 */
export function updateStats(correct) {
  const stats = getStats();
  stats.totalAttempts += 1;
  if (correct) {
    stats.correctAnswers += 1;
  }
  stats.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
}

/**
 * Get current stats
 */
export function getStats() {
  const stored = localStorage.getItem(STORAGE_KEY_STATS);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    totalAttempts: 0,
    correctAnswers: 0,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get success rate as percentage
 */
export function getSuccessRate() {
  const stats = getStats();
  if (stats.totalAttempts === 0) return 0;
  return Math.round((stats.correctAnswers / stats.totalAttempts) * 100);
}

/**
 * Clear all history and stats
 */
export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY_HISTORY);
  localStorage.removeItem(STORAGE_KEY_STATS);
}
