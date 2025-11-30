const bcrypt = require('bcrypt');
const pool = require('./db');
require('dotenv').config();

async function createUsers() {
  const users = [
    { username: 'admin', password: 'AdminPass123' },
    { username: 'user1', password: 'Password1' }
  ];

  try {
    const conn = await pool.getConnection();
    try {
      for (const u of users) {
        const hash = await bcrypt.hash(u.password, 10);
        await conn.query(
          'INSERT IGNORE INTO users (username, password_hash) VALUES (?, ?)',
          [u.username, hash]
        );
        console.log(`Inserted user ${u.username}`);
      }
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Failed to create users:', err);
  } finally {
    process.exit(0);
  }
}

createUsers();
