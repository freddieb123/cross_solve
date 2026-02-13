const fs = require('fs');
const path = require('path');
const pool = require('./db');

// Simple CSV parser
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parsing - handle quoted fields
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim().replace(/^"|"$/g, ''));

    const record = {};
    headers.forEach((header, idx) => {
      record[header] = fields[idx] || '';
    });
    records.push(record);
  }

  return records;
}

async function loadClues() {
  try {
    console.log('Loading clues from CSV...');

    // Read the CSV file
    const csvPath = path.join(__dirname, '../clues.csv');
    if (!fs.existsSync(csvPath)) {
      throw new Error(`clues.csv not found at ${csvPath}`);
    }

    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parseCSV(fileContent);

    // Create clues table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clues (
        rowid INTEGER PRIMARY KEY,
        puzzle_name VARCHAR(255),
        puzzle_date VARCHAR(50),
        clue TEXT,
        answer VARCHAR(255),
        definition TEXT,
        source_url VARCHAR(500)
      )
    `);

    console.log(`Parsed ${records.length} records from CSV`);

    // Insert clues (using INSERT OR IGNORE for sqlite compatibility)
    let inserted = 0;
    for (const record of records) {
      try {
        await pool.query(
          `INSERT INTO clues (rowid, puzzle_name, puzzle_date, clue, answer, definition, source_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT DO NOTHING`,
          [
            record.rowid || null,
            record.puzzle_name || '',
            record.puzzle_date || '',
            record.clue || '',
            record.answer || '',
            record.definition || '',
            record.source_url || '',
          ]
        );
        inserted++;
      } catch (err) {
        console.error('Error inserting record:', record, err.message);
      }
    }

    console.log(`✓ Successfully inserted ${inserted} clues into database`);
    process.exit(0);
  } catch (error) {
    console.error('✗ Error loading clues:', error);
    process.exit(1);
  }
}

loadClues();
