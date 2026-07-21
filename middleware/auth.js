var jwt = require('jsonwebtoken');

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

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { auth };
