// Auth middleware supporting real session headers or simulated demo user switching
const db = require('../../database/db');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers['x-demo-user-id'];
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Sign in or Account Registration required to access this feature.' });
    }

    const userId = authHeader.replace('Bearer ', '').trim();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(401).json({ error: 'User session invalid or expired. Please sign in.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed', details: err.message });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden. Requires role: ${roles.join(' or ')}` });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
