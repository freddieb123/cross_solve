const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function initDatabase() {
  try {
    console.log('Initializing database schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

    await pool.query(schema);

    console.log('✓ Database schema initialized successfully');
    console.log('Tables created:');
    console.log('  - users');
    console.log('  - user_sessions');
    console.log('  - user_attempts');
    console.log('  - saved_clues');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
