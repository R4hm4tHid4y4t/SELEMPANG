// ============================================================
// ROUTES - PROFILE ROUTES
// src/routes/profile.js
// ============================================================

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');
const { uploadProfile, handleUploadError } = require('../middleware/upload');

// Get profile
router.get('/', authenticate, profileController.getProfile);

// Update profile
router.put('/', authenticate, uploadProfile.single('foto_profil'), handleUploadError, profileController.updateProfile);

// Change password
router.put('/password', authenticate, profileController.changePassword);

module.exports = router;
