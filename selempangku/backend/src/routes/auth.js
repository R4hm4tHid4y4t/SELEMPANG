// ============================================================
// ROUTES - AUTH ROUTES
// src/routes/auth.js
// ============================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminAuthController = require('../controllers/adminAuthController');
const { authenticate } = require('../middleware/auth');

// ============================================================
// USER AUTHENTICATION ROUTES
// ============================================================
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authenticate, authController.getCurrentUser);

// ============================================================
// ADMIN AUTHENTICATION ROUTES
// ============================================================
router.post('/admin/login', adminAuthController.loginAdmin);

module.exports = router;
