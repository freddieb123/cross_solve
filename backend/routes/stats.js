const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/stats/attempt
 * Record a clue attempt (requires auth)
 * Body: { clueRowid, lettersRevealed, totalLetters, correct, puzzleType }
 * Returns: { success: boolean, attemptId: number }
 */
router.post('/attempt', authMiddleware, async (req, res) => {
  try {
    const { clueRowid, lettersRevealed, totalLetters, correct, puzzleType } = req.body;
    const userId = req.userId;

    if (clueRowid === undefined || totalLetters === undefined || correct === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO user_attempts
       (user_id, clue_rowid, letters_revealed, total_letters, correct, puzzle_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [userId, clueRowid, lettersRevealed || 0, totalLetters, correct, puzzleType]
    );

    res.json({ success: true, attemptId: result.rows[0].id });
  } catch (error) {
    console.error('Error recording attempt:', error);
    res.status(500).json({ error: 'Failed to record attempt' });
  }
});

/**
 * GET /api/stats/summary
 * Get overall statistics (requires auth)
 * Returns: { totalAttempts, correctAnswers, successRate, avgLettersRevealedPct, last10AvgLettersRevealedPct }
 */
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Get all-time stats
    const allTimeResult = await pool.query(
      `SELECT
        COUNT(*) as total_attempts,
        SUM(CASE WHEN correct THEN 1 ELSE 0 END) as correct_answers,
        AVG((letters_revealed::FLOAT / total_letters) * 100) as avg_letters_revealed_pct
       FROM user_attempts
       WHERE user_id = $1`,
      [userId]
    );

    const allTimeRow = allTimeResult.rows[0];
    const totalAttempts = parseInt(allTimeRow.total_attempts) || 0;
    const correctAnswers = parseInt(allTimeRow.correct_answers) || 0;
    const successRate = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
    const avgLettersRevealedPct = allTimeRow.avg_letters_revealed_pct
      ? Math.round(parseFloat(allTimeRow.avg_letters_revealed_pct) * 10) / 10
      : 0;

    // Get last 10 stats
    const last10Result = await pool.query(
      `SELECT
        AVG((letters_revealed::FLOAT / total_letters) * 100) as avg_letters_revealed_pct
       FROM (
         SELECT letters_revealed, total_letters FROM user_attempts
         WHERE user_id = $1
         ORDER BY attempted_at DESC
         LIMIT 10
       ) recent`,
      [userId]
    );

    const last10Row = last10Result.rows[0];
    const last10AvgLettersRevealedPct = last10Row.avg_letters_revealed_pct
      ? Math.round(parseFloat(last10Row.avg_letters_revealed_pct) * 10) / 10
      : 0;

    res.json({
      totalAttempts,
      correctAnswers,
      successRate,
      avgLettersRevealedPct,
      last10AvgLettersRevealedPct,
    });
  } catch (error) {
    console.error('Error fetching stats summary:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * GET /api/stats/history
 * Get attempt history (requires auth)
 * Query params: ?limit=50
 * Returns: Array of attempts with clue details
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit) || 50, 500);

    const result = await pool.query(
      `SELECT
        ua.id,
        ua.clue_rowid,
        ua.letters_revealed,
        ua.total_letters,
        ua.correct,
        ua.puzzle_type,
        ua.attempted_at,
        c.clue,
        c.answer,
        ROUND((ua.letters_revealed::FLOAT / ua.total_letters) * 100) as letters_revealed_pct
       FROM user_attempts ua
       JOIN clues c ON ua.clue_rowid = c.rowid
       WHERE ua.user_id = $1
       ORDER BY ua.attempted_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
