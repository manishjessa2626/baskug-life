var express = require('express');
var { getAuth } = require('firebase-admin/auth');
var { auth } = require('../middleware/auth');

function createRouter(db) {
  var router = express.Router();

  function getUserData(userId, key) {
    var row = db.prepare('SELECT data_value FROM user_data WHERE user_id = ? AND data_key = ?').get(userId, key);
    return row ? JSON.parse(row.data_value) : null;
  }

  function setUserData(userId, key, value) {
    var str = JSON.stringify(value);
    db.prepare('INSERT INTO user_data (user_id, data_key, data_value) VALUES (?, ?, ?) ON CONFLICT(user_id, data_key) DO UPDATE SET data_value = ?')
      .run(userId, key, str, str);
  }

  // POST /api/auth/firebase — Verify Firebase ID token, find or create user
  router.post('/firebase', function(req, res) {
    try {
      var { token, name, gender, age, phone } = req.body;
      if (!token) return res.status(400).json({ error: 'Token required' });

      getAuth().verifyIdToken(token).then(function(decoded) {
        var uid = decoded.uid;
        var email = decoded.email || '';
        var displayName = decoded.name || name || '';

        var user = db.prepare('SELECT * FROM users WHERE id = ?').get(uid);
        if (!user) {
          db.prepare(
            'INSERT INTO users (id, email, name, gender, age, height, weight, activity_level, cycle_data, phone, created_at) VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?, ?, datetime(\'now\'))'
          ).run(uid, email, displayName, gender || '', age || 0, 'moderate', '{}', phone || '');

          user = db.prepare('SELECT * FROM users WHERE id = ?').get(uid);

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
            setUserData(uid, key, defaults[key]);
          });
        } else if (name) {
          db.prepare('UPDATE users SET name=?, gender=?, age=?, phone=? WHERE id=?')
            .run(name, gender || '', age || 0, phone || '', uid);
          user = db.prepare('SELECT * FROM users WHERE id = ?').get(uid);
        }

        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });

        res.json({
          user: {
            id: user.id, email: user.email, name: user.name,
            gender: user.gender, age: user.age, height: user.height, weight: user.weight,
            activityLevel: user.activity_level, cycleData: JSON.parse(user.cycle_data || '{}'), phone: user.phone
          }
        });
      }).catch(function(e) {
        console.error('Firebase verify error:', e.message);
        res.status(401).json({ error: 'Invalid Firebase token' });
      });
    } catch (e) {
      console.error('Firebase auth error:', e.message);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  // GET /api/auth/me
  router.get('/me', auth, function(req, res) {
    try {
      var user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({
        id: user.id, email: user.email, name: user.name,
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
