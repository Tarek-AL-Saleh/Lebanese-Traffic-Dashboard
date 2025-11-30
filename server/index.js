const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const { logActivity } = require('./logger');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
// Allow requests from the front-end dev server (adjust origin in production)
app.use(cors({ origin: '*' }));

// Middleware: verify JWT and attach user to req.user
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[0] === 'Bearer' ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  const secret = process.env.JWT_SECRET || 'dev_secret_change_this';
  try {
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// GET /api/data?limit=100
app.get('/api/data', authenticateToken, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '100', 10) || 100, 10000);
  try {
    const [rows] = await pool.query('SELECT id, `date`, `time`, lon, lat, course, velocity, osm_id FROM traffic ORDER BY id LIMIT ?', [limit]);
    const actor = (req.user && req.user.username) || req.ip;
    logActivity(actor, `fetch_data limit=${limit}`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  try {
    const [rows] = await pool.query('SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1', [username]);
    const user = rows[0];
    if (!user) {
      logActivity(username, 'login_failed_user_not_found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      logActivity(username, 'login_failed_bad_password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'dev_secret_change_this';
    const token = jwt.sign({ sub: user.id, username: user.username }, secret, { expiresIn: '2h' });

    logActivity(username, 'login_success');
    res.json({ token });
  } catch (err) {
    console.error('Auth error', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
