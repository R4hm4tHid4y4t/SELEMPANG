// ============================================================
// ROUTES - PRODUCT ROUTES
// src/routes/products.js
// ============================================================

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer configuration for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/produk');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Routes
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authenticate, authorizeAdmin, upload.single('gambar_produk'), productController.create);
router.put('/:id', authenticate, authorizeAdmin, upload.single('gambar_produk'), productController.update);
router.delete('/:id', authenticate, authorizeAdmin, productController.delete);

module.exports = router;
