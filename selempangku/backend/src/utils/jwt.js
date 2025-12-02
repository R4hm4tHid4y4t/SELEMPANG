// backend/src/utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (userId, role, expiresIn = '7d') => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
