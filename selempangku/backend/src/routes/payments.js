// ============================================================
// ROUTES - PAYMENT ROUTES
// src/routes/payments.js
// ============================================================

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const multer = require('multer');

// Multer configuration for payment proof
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/bukti_pembayaran');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', authenticate, upload.single('bukti_pembayaran'), paymentController.create);
router.get('/', authenticate, paymentController.getByUser);
router.get('/admin/all', authenticate, authorizeAdmin, paymentController.getAll);
router.put('/:id/verify', authenticate, authorizeAdmin, paymentController.verify);

module.exports = router;