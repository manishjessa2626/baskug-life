var { getAuth } = require('firebase-admin/auth');

function auth(req, res, next) {
  var token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7);
  }

  if (!token) {
    token = req.cookies && req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  getAuth().verifyIdToken(token).then(function(decoded) {
    req.userId = decoded.uid;
    next();
  }).catch(function(e) {
    console.error('Token verification error:', e.message);
    return res.status(401).json({ error: 'Invalid token' });
  });
}

module.exports = { auth };
