// ============================================================
// MIDDLEWARE - AUTHENTICATION
// src/middleware/auth.js
// ============================================================

const { verifyToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const authorizeCustomer = (req, res, next) => {
  if (req.role !== 'Customer') {
    return res.status(403).json({ message: 'Customer access required' });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeCustomer
};
