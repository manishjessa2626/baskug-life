var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var { auth } = require('../middleware/auth');

function createRouter(db) {
  var router = express.Router();

  // Helpers
  function getUserData(userId, key) {
    var row = db.prepare('SELECT data_value FROM user_data WHERE user_id = ? AND data_key = ?').get(userId, key);
    return row ? JSON.parse(row.data_value) : null;
  }

  function setUserData(userId, key, value) {
    var str = JSON.stringify(value);
    db.prepare('INSERT INTO user_data (user_id, data_key, data_value) VALUES (?, ?, ?) ON CONFLICT(user_id, data_key) DO UPDATE SET data_value = ?')
      .run(userId, key, str, str);
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // POST /api/auth/register
  router.post('/register', function(req, res) {
    try {
      var { username, email, password, name, gender, age, phone } = req.body || {};

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password required' });
      }

      username = username.trim();
      email = email.trim().toLowerCase();

      if (username.length < 2) {
        return res.status(400).json({ error: 'Username must be at least 2 characters' });
      }

      if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      var existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
      if (existing) {
        return res.status(400).json({ error: 'Username or email already taken' });
      }

      var hash = bcrypt.hashSync(password, 12);
      var result = db.prepare(
        'INSERT INTO users (username, email, password_hash, name, gender, age, height, weight, activity_level, phone) VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?)'
      ).run(username, email, hash, name || '', gender || '', age || 0, 'moderate', phone || '');

      var userId = result.lastInsertRowid;

      var defaults = {
        baskug_schedule: {},
        baskug_meals: {},
        baskug_workouts: {},
        baskug_routines: [],
        baskug_routine_log: {},
        baskug_hobbies: [],
        baskug_symptoms: {},
        baskug_mealplan: {},
        baskug_work: {}
      };
      Object.keys(defaults).forEach(function(key) {
        setUserData(userId, key, defaults[key]);
      });

      var token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      res.json({ token, user: { id: userId, username, email, name, gender, age, phone } });
    } catch (e) {
      console.error('Register error:', e.message);
      if (e.message && e.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Username or email already taken' });
      }
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  });

  // POST /api/auth/login
  router.post('/login', function(req, res) {
    try {
      var { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      email = email.trim().toLowerCase();

      var user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      res.json({
        token,
        user: {
          id: user.id, username: user.username, email: user.email, name: user.name,
          gender: user.gender, age: user.age, height: user.height, weight: user.weight,
          activityLevel: user.activity_level, cycleData: JSON.parse(user.cycle_data || '{}'), phone: user.phone
        }
      });
    } catch (e) {
      console.error('Login error:', e.message);
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  });

  // GET /api/auth/me
  router.get('/me', auth, function(req, res) {
    try {
      var user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({
        id: user.id, username: user.username, email: user.email, name: user.name,
        gender: user.gender, age: user.age, height: user.height, weight: user.weight,
        activityLevel: user.activity_level, cycleData: JSON.parse(user.cycle_data || '{}'), phone: user.phone
      });
    } catch (e) {
      console.error('Me error:', e.message);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  // POST /api/auth/logout
  router.post('/logout', function(req, res) {
    res.clearCookie('token');
    res.json({ ok: true });
  });

  return router;
}

module.exports = { createRouter };
