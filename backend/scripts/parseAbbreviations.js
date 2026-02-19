#!/usr/bin/env node
/**
 * Parses abbreviations.md (RTF format) into a JSON file.
 * Groups entries by meaning → array of abbreviations.
 * Output: backend/data/abbreviations.json
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '../../abbreviations.md');
const outputPath = path.resolve(__dirname, '../data/abbreviations.json');

const content = fs.readFileSync(inputPath, 'utf8');
const meaningMap = {};
const lines = content.split(/\r?\n/);

for (const line of lines) {
  // Strip RTF control words: \word or \word123
  let cleaned = line.replace(/\\[a-zA-Z]+\d*/g, ' ');
  // Remove RTF grouping chars
  cleaned = cleaned.replace(/[{}]/g, '');
  // Remove trailing backslash (RTF soft newline)
  cleaned = cleaned.replace(/\\$/, '');
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Find first ': ' separator
  const colonIdx = cleaned.indexOf(': ');
  if (colonIdx <= 0 || colonIdx >= cleaned.length - 2) continue;

  const abbr = cleaned.substring(0, colonIdx).trim().toLowerCase();
  const meaning = cleaned.substring(colonIdx + 2).trim().toLowerCase();

  // Validate abbreviation: starts with letter, only safe chars, reasonable length
  if (
    !abbr || !meaning ||
    abbr.length < 1 || abbr.length > 30 ||
    meaning.length < 1 ||
    !/^[a-z]/.test(abbr) ||
    !/^[a-z0-9 \-'.()]+$/.test(abbr)
  ) continue;

  if (!meaningMap[meaning]) meaningMap[meaning] = [];
  if (!meaningMap[meaning].includes(abbr)) {
    meaningMap[meaning].push(abbr);
  }
}

const entries = Object.entries(meaningMap)
  .filter(([m, a]) => m.length > 0 && a.length > 0)
  .map(([meaning, abbreviations]) => ({ meaning, abbreviations }));

fs.writeFileSync(outputPath, JSON.stringify({ entries }, null, 2));
console.log(`Wrote ${entries.length} entries to ${outputPath}`);
