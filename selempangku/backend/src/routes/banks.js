// ============================================================
// ROUTES - BANK ROUTES
// src/routes/banks.js
// ============================================================

const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/', bankController.getAll);
router.post('/', authenticate, authorizeAdmin, bankController.create);
router.put('/:id', authenticate, authorizeAdmin, bankController.update);
router.delete('/:id', authenticate, authorizeAdmin, bankController.delete);

module.exports = router;