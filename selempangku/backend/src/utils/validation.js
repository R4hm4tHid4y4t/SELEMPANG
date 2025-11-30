// ============================================================
// UTILITIES - VALIDATION HELPER
// src/utils/validation.js
// ============================================================

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  // Minimum 8 characters
  return password.length >= 8;
};

const validatePhoneNumber = (phone) => {
  const re = /^(\+62|0)[0-9]{9,12}$/;
  return re.test(phone);
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  generateOTP
};
