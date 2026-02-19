const express = require('express');
const router = express.Router();
const path = require('path');
const data = require('../data/abbreviations.json');

// GET /api/abbreviations
// Returns all parsed abbreviation entries
router.get('/', (req, res) => {
  res.json(data);
});

module.exports = router;
