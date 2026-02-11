const express = require('express');
const router = express.Router();
const pool = require('../db');
const { getPuzzleType } = require('../utils/puzzleTypes');

/**
 * GET /api/clues/types
 * Return available puzzle types
 */
router.get('/types', (req, res) => {
  res.json({
    types: ['quick_cryptic', 'cryptic', 'jumbo', 'mephisto'],
    labels: {
      quick_cryptic: 'Times Quick Cryptic',
      cryptic: 'Times Cryptic',
      jumbo: 'Jumbo',
      mephisto: 'Mephisto',
    },
  });
});

/**
 * GET /api/clues/random
 * Get a random clue for a given puzzle type
 * Query params: type (required) - one of: quick_cryptic, cryptic, jumbo, mephisto
 */
router.get('/random', async (req, res) => {
  try {
    const { type } = req.query;

    if (!type || !['quick_cryptic', 'cryptic', 'jumbo', 'mephisto'].includes(type)) {
      return res.status(400).json({ error: 'Invalid puzzle type' });
    }

    // Get all clues, then filter by type in memory to handle complex categorization
    const result = await pool.query(`
      SELECT rowid, clue, answer, definition, puzzle_name, puzzle_date, source_url
      FROM clues
      ORDER BY RANDOM()
      LIMIT 1000
    `);

    // Filter by puzzle type
    const cluesByType = result.rows.filter(clue => getPuzzleType(clue.puzzle_name) === type);

    if (cluesByType.length === 0) {
      return res.status(404).json({ error: 'No clues found for this type' });
    }

    // Pick random one from filtered results
    const randomClue = cluesByType[Math.floor(Math.random() * cluesByType.length)];

    // Remove answer from response (user shouldn't see it yet)
    const { answer, ...clueWithoutAnswer } = randomClue;

    const answerLength = answer ? answer.length : 0;
    const answerLetterCount = answer ? (answer.match(/\w/g) || []).length : 0;

    res.json({
      ...clueWithoutAnswer,
      answerLength,
      answerLetterCount,
    });
  } catch (err) {
    console.error('Error fetching random clue:', err.message, err.stack);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

/**
 * POST /api/clues/check
 * Verify if an answer is correct
 * Body: { rowid: number, userAnswer: string }
 */
router.post('/check', async (req, res) => {
  try {
    const { rowid, userAnswer } = req.body;

    if (!rowid || !userAnswer) {
      return res.status(400).json({ error: 'Missing rowid or userAnswer' });
    }

    const result = await pool.query('SELECT answer, source_url FROM clues WHERE rowid = $1', [rowid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Clue not found' });
    }

    const { answer, source_url } = result.rows[0];
    const correct = userAnswer.toUpperCase() === answer.toUpperCase();

    res.json({
      correct,
      answer: answer,
      source_url: source_url,
    });
  } catch (err) {
    console.error('Error checking answer:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/clues/hint
 * Get hint info for a clue (definition highlight)
 * Body: { rowid: number }
 */
router.post('/hint', async (req, res) => {
  try {
    const { rowid } = req.body;

    if (!rowid) {
      return res.status(400).json({ error: 'Missing rowid' });
    }

    const result = await pool.query('SELECT clue, definition FROM clues WHERE rowid = $1', [rowid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Clue not found' });
    }

    const { clue, definition } = result.rows[0];

    // Handle definitions with slashes (e.g., "Fire/bank employee" should match "Fire bank employee")
    // Try exact match first, then try with slashes replaced by spaces
    let definitionStart = clue.toLowerCase().indexOf(definition.toLowerCase());
    let searchDefinition = definition;

    if (definitionStart === -1) {
      // Try replacing slashes with spaces in the definition
      searchDefinition = definition.replace(/\//g, ' ');
      definitionStart = clue.toLowerCase().indexOf(searchDefinition.toLowerCase());
    }

    res.json({
      clue,
      definition,
      // Return the index and length of definition in the clue for frontend to highlight
      definitionStart: definitionStart >= 0 ? definitionStart : 0,
      definitionLength: searchDefinition.length,
    });
  } catch (err) {
    console.error('Error getting hint:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/clues/letter-hint
 * Get a specific letter from the answer at a position
 * Body: { rowid: number, position: number }
 */
router.post('/letter-hint', async (req, res) => {
  try {
    const { rowid, position } = req.body;

    if (!rowid || position === undefined) {
      return res.status(400).json({ error: 'Missing rowid or position' });
    }

    const result = await pool.query('SELECT answer FROM clues WHERE rowid = $1', [rowid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Clue not found' });
    }

    const answer = result.rows[0].answer;
    if (position < 0 || position >= answer.length) {
      return res.status(400).json({ error: 'Invalid position' });
    }

    const letter = answer[position];

    res.json({
      position,
      letter: letter === ' ' ? ' ' : letter.toUpperCase(),
    });
  } catch (err) {
    console.error('Error getting letter hint:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/clues/by-id
 * Get a specific clue by rowid
 * Query params: rowid (required)
 */
router.get('/by-id', async (req, res) => {
  try {
    const { rowid } = req.query;

    if (!rowid) {
      return res.status(400).json({ error: 'Missing rowid' });
    }

    const result = await pool.query(
      'SELECT rowid, clue, answer, definition, puzzle_name, puzzle_date, source_url FROM clues WHERE rowid = $1',
      [rowid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Clue not found' });
    }

    const clueRow = result.rows[0];
    const { answer, ...clueWithoutAnswer } = clueRow;

    const answerLength = answer ? answer.length : 0;
    const answerLetterCount = answer ? (answer.match(/\w/g) || []).length : 0;

    res.json({
      ...clueWithoutAnswer,
      answerLength,
      answerLetterCount,
    });
  } catch (err) {
    console.error('Error fetching clue by id:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
