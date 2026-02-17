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

    // Insert clues in batches of 100 to avoid connection timeouts
    let inserted = 0;
    const batchSize = 100;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      try {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');

          for (const record of batch) {
            try {
              await client.query(
                `INSERT INTO clues (rowid, puzzle_name, puzzle_date, clue, answer, definition, source_url)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (rowid) DO NOTHING`,
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
              console.error(`Error inserting record ${record.rowid}:`, err.message);
            }
          }

          await client.query('COMMIT');
          console.log(`Batch ${Math.floor(i / batchSize) + 1}: Inserted ${batch.length} records (total: ${inserted}/${records.length})`);
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
      } catch (err) {
        console.error(`Error processing batch at index ${i}:`, err.message);
      }

      // Small delay between batches to avoid overwhelming the connection
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`✓ Successfully inserted ${inserted} clues into database`);
    process.exit(0);
  } catch (error) {
    console.error('✗ Error loading clues:', error);
    process.exit(1);
  }
}

loadClues();
