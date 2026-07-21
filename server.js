require('dotenv').config();

var express = require('express');
var helmet = require('helmet');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');
var http = require('http');
var { Server } = require('socket.io');
var Database = require('better-sqlite3');
var admin = require('firebase-admin');
var { getAuth } = require('firebase-admin/auth');

var { auth } = require('./middleware/auth');
var { apiLimiter } = require('./middleware/rateLimit');
var { createRouter: createAuthRouter } = require('./routes/auth');
var { generatePlan, getEquipmentLabel } = require('./workout/exercises');

// Firebase Admin — support local file or env var (for Render/git)
var serviceAccount;
try {
  serviceAccount = require('./service-account.json');
} catch(e) {
  // Fallback: read from env var (base64-encoded JSON)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString());
  } else {
    console.error('FATAL: No Firebase service account found. Set FIREBASE_SERVICE_ACCOUNT env var or add service-account.json');
    process.exit(1);
  }
}
admin.initializeApp({
  credential: admin.cert(serviceAccount)
});

var app = express();
var server = http.createServer(app);
var PORT = process.env.PORT || 3001;

// Socket.IO — real-time sync
var io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*', credentials: true }
});

io.use(function(socket, next) {
  var token = socket.handshake.auth.token;
  if (!token) return next(new Error('Not authenticated'));
  getAuth().verifyIdToken(token).then(function(decoded) {
    socket.userId = decoded.uid;
    next();
  }).catch(function() {
    next(new Error('Invalid token'));
  });
});

io.on('connection', function(socket) {
  socket.join('user:' + socket.userId);
  console.log('User ' + socket.userId + ' connected (socket ' + socket.id + ')');
  socket.on('disconnect', function() {
    console.log('User ' + socket.userId + ' disconnected');
  });
});

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Rate limit on all API routes
app.use('/api/', apiLimiter);

app.use(express.static(path.join(__dirname, 'public')));

// Database setup
var dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

var dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'baskug.db');
var db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Migrate old schema (INTEGER id) -> new schema (TEXT id) if needed
var colInfo = db.prepare("PRAGMA table_info('users')").all();
var hasOldSchema = colInfo.some(function(c) { return c.name === 'username'; });
if (hasOldSchema) {
  console.log('Migrating database schema...');
  db.exec('DROP TABLE IF EXISTS user_data; DROP TABLE IF EXISTS users;');
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL DEFAULT '',
    name TEXT DEFAULT '',
    gender TEXT DEFAULT '',
    age INTEGER DEFAULT 0,
    height REAL DEFAULT 0,
    weight REAL DEFAULT 0,
    activity_level TEXT DEFAULT 'moderate',
    cycle_data TEXT DEFAULT '{}',
    phone TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS user_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    data_key TEXT NOT NULL,
    data_value TEXT NOT NULL DEFAULT '{}',
    UNIQUE(user_id, data_key),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Helper: get/set user data
function getUserData(userId, key) {
  var row = db.prepare('SELECT data_value FROM user_data WHERE user_id = ? AND data_key = ?').get(userId, key);
  return row ? JSON.parse(row.data_value) : null;
}

function setUserData(userId, key, value) {
  var str = JSON.stringify(value);
  db.prepare('INSERT INTO user_data (user_id, data_key, data_value) VALUES (?, ?, ?) ON CONFLICT(user_id, data_key) DO UPDATE SET data_value = ?')
    .run(userId, key, str, str);
}

// ============ AUTH ROUTES ============
app.use('/api/auth', createAuthRouter(db));

// ============ USER PROFILE ============
app.put('/api/user/profile', auth, function(req, res) {
  try {
    var { name, gender, age, cycleData, phone } = req.body;
    var stmt = db.prepare('UPDATE users SET name=?, gender=?, age=?, cycle_data=?, phone=? WHERE id=?');
    stmt.run(name || '', gender || '', age || 0, JSON.stringify(cycleData || {}), phone || '', req.userId);
    res.json({ ok: true });
  } catch (e) {
    console.error('Profile update error:', e.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============ DATA API ============
app.get('/api/data/:key', auth, function(req, res) {
  try {
    var val = getUserData(req.userId, req.params.key);
    res.json(val !== null ? val : {});
  } catch (e) {
    console.error('Data get error:', e.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.put('/api/data/:key', auth, function(req, res) {
  try {
    setUserData(req.userId, req.params.key, req.body);
    io.to('user:' + req.userId).emit('data-update', { key: req.params.key, value: req.body });
    res.json({ ok: true });
  } catch (e) {
    console.error('Data put error:', e.message);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.delete('/api/data/:key', auth, function(req, res) {
  try {
    db.prepare('DELETE FROM user_data WHERE user_id = ? AND data_key = ?').run(req.userId, req.params.key);
    io.to('user:' + req.userId).emit('data-delete', { key: req.params.key });
    res.json({ ok: true });
  } catch (e) {
    console.error('Data delete error:', e.message);
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

// ============ WORKOUT PLAN ============
app.get('/api/workout/plan', auth, function(req, res) {
  try {
    var val = getUserData(req.userId, 'baskug_workout_plan');
    if (!val) return res.json(null);
    res.json(val);
  } catch (e) {
    console.error('Workout plan get error:', e.message);
    res.status(500).json({ error: 'Failed to fetch workout plan' });
  }
});

app.post('/api/workout/plan/generate', auth, function(req, res) {
  try {
    var prefs = req.body.preferences || {};
    var schedule = req.body.schedule || null;
    var userRow = db.prepare('SELECT age, gender, activity_level, weight FROM users WHERE id = ?').get(req.userId);
    if (!prefs.intensity && userRow) {
      if (userRow.activity_level === 'sedentary') prefs.intensity = 'beginner';
      else if (userRow.activity_level === 'very_active') prefs.intensity = 'advanced';
    }
    var planPrefs = { goal: prefs.goal || 'general', equipment: prefs.equipment || [] };
    if (prefs.intensity) planPrefs.intensity = prefs.intensity;
    var userSeed = 0;
    if (typeof req.userId === 'string') {
      for (var i = 0; i < req.userId.length; i++) userSeed += req.userId.charCodeAt(i);
    }
    var plan = generatePlan(planPrefs, { userSeed: userSeed, schedule: schedule });
    setUserData(req.userId, 'baskug_workout_plan', plan);
    io.to('user:' + req.userId).emit('data-update', { key: 'baskug_workout_plan', value: plan });
    res.json(plan);
  } catch (e) {
    console.error('Workout plan generate error:', e.message, e.stack);
    res.status(500).json({ error: 'Failed to generate workout plan' });
  }
});

app.put('/api/workout/plan/preferences', auth, function(req, res) {
  try {
    var existing = getUserData(req.userId, 'baskug_workout_plan') || {};
    existing.preferences = req.body;
    setUserData(req.userId, 'baskug_workout_plan', existing);
    res.json({ ok: true });
  } catch (e) {
    console.error('Workout prefs error:', e.message);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

// ============ ERROR HANDLER ============
app.use(function(err, req, res, next) {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============ SPA FALLBACK ============
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============ START ============
server.listen(PORT, function() {
  console.log('BASKUG Life server running on http://localhost:' + PORT);
});
