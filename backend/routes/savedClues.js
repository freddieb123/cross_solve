const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/saved-clues
 * Save a clue for later (requires auth)
 * Body: { clueRowid }
 * Returns: { success: boolean, savedClueId: number }
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { clueRowid } = req.body;
    const userId = req.userId;

    if (clueRowid === undefined) {
      return res.status(400).json({ error: 'Missing clueRowid' });
    }

    const result = await pool.query(
      `INSERT INTO saved_clues (user_id, clue_rowid)
       VALUES ($1, $2)
       ON CONFLICT (user_id, clue_rowid) DO NOTHING
       RETURNING id`,
      [userId, clueRowid]
    );

    if (result.rows.length === 0) {
      // Clue already saved, fetch the existing one
      const existing = await pool.query(
        'SELECT id FROM saved_clues WHERE user_id = $1 AND clue_rowid = $2',
        [userId, clueRowid]
      );
      return res.json({ success: true, savedClueId: existing.rows[0].id });
    }

    res.json({ success: true, savedClueId: result.rows[0].id });
  } catch (error) {
    console.error('Error saving clue:', error);
    res.status(500).json({ error: 'Failed to save clue' });
  }
});

/**
 * GET /api/saved-clues
 * Get all saved clues (requires auth)
 * Returns: Array of saved clues with details
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT
        sc.id,
        sc.clue_rowid,
        sc.saved_at,
        c.clue,
        c.puzzle_name as type,
        c.source_url,
        LENGTH(c.answer) as answerLength
       FROM saved_clues sc
       JOIN clues c ON sc.clue_rowid = c.rowid
       WHERE sc.user_id = $1
       ORDER BY sc.saved_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching saved clues:', error);
    res.status(500).json({ error: 'Failed to fetch saved clues' });
  }
});

/**
 * DELETE /api/saved-clues/:clueRowid
 * Remove a saved clue (requires auth)
 * Returns: { success: boolean }
 */
router.delete('/:clueRowid', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { clueRowid } = req.params;

    await pool.query(
      'DELETE FROM saved_clues WHERE user_id = $1 AND clue_rowid = $2',
      [userId, parseInt(clueRowid)]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved clue:', error);
    res.status(500).json({ error: 'Failed to delete saved clue' });
  }
});

module.exports = router;
