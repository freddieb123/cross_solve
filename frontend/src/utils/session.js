/**
 * Session management utility for tracking unique users via UUID
 * Stores session ID in localStorage with key 'cryptic_session_id'
 */

const SESSION_STORAGE_KEY = 'cryptic_session_id';

/**
 * Generate a UUID v4
 * @returns {string} UUID string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create session ID from localStorage
 * @returns {string} Session ID (UUID)
 */
export function getOrCreateSessionId() {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Get current session ID without creating one
 * @returns {string|null} Session ID if exists, null otherwise
 */
export function getSessionId() {
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

/**
 * Clear the session ID (used for testing)
 */
export function clearSessionId() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
