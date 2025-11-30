// ============================================================
// ROUTES - ORDER ROUTES
// src/routes/orders.js
// ============================================================

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorizeAdmin, authorizeCustomer } = require('../middleware/auth');

router.post('/', authenticate, authorizeCustomer, orderController.create);
router.get('/', authenticate, orderController.getByUser);
router.get('/:id', authenticate, orderController.getById);
router.get('/admin/all', authenticate, authorizeAdmin, orderController.getAll);
router.put('/:id/status', authenticate, authorizeAdmin, orderController.updateStatus);

module.exports = router;
