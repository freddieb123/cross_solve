#!/usr/bin/env node

/**
 * Test script to verify Daily Cryptic setup
 * Run: node test-setup.js
 */

const http = require('http');

function testURL(url, name) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.get(url, { timeout: 3000 }, (res) => {
      const duration = Date.now() - startTime;
      console.log(`  ✅ ${name} (${res.statusCode}) - ${duration}ms`);
      res.on('data', () => {});
      res.on('end', () => resolve(true));
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`  ❌ ${name} - Timeout`);
      resolve(false);
    });

    req.on('error', (err) => {
      console.log(`  ❌ ${name} - ${err.message}`);
      resolve(false);
    });
  });
}

async function testDatabase() {
  require('dotenv').config();

  return new Promise((resolve) => {
    try {
      const pool = require('./backend/db.js');
      pool.query('SELECT COUNT(*) as count FROM clues').then((res) => {
        const count = res.rows[0].count;
        console.log(`  ✅ Database connected - ${count} clues available`);
        process.exit(0);
      }).catch((err) => {
        console.log(`  ❌ Database - ${err.message}`);
        resolve(false);
      });
    } catch (err) {
      console.log(`  ❌ Database - ${err.message}`);
      resolve(false);
    }
  });
}

async function runTests() {
  console.log('\n🧪 Daily Cryptic Setup Test\n');

  console.log('📡 Checking Services...');
  const backend = await testURL('http://localhost:5000/api/health', 'Backend Health Check');
  const frontend = await testURL('http://localhost:3000/', 'Frontend Server');

  console.log('\n🗄️  Checking Database...');
  await testDatabase();

  console.log('\n📊 Test Summary');
  console.log(`  Backend:  ${backend ? '✅' : '❌'}`);
  console.log(`  Frontend: ${frontend ? '✅' : '❌'}`);

  if (!backend || !frontend) {
    console.log('\n💡 Make sure both servers are running:');
    console.log('   Backend:  cd backend && npm start');
    console.log('   Frontend: cd frontend && npm start');
  }
}

console.log('Starting tests...\n');
runTests();
