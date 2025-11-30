// ============================================================
// ROUTES - ADMIN ROUTES
// src/routes/admin.js
// ============================================================

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/dashboard', authenticate, authorizeAdmin, adminController.getDashboard);
router.get('/members', authenticate, authorizeAdmin, adminController.getMembers);
router.get('/reports', authenticate, authorizeAdmin, adminController.getReports);
router.get('/reports/daily', authenticate, authorizeAdmin, adminController.getDailyReport);
router.get('/reports/monthly', authenticate, authorizeAdmin, adminController.getMonthlyReport);

module.exports = router;
