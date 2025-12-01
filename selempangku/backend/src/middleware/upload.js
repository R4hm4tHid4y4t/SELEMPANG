// ============================================================
// MIDDLEWARE - FILE UPLOAD (MULTER)
// src/middleware/upload.js
// ============================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configurations for different upload types
const createStorage = (folder) => {
  const uploadPath = path.join(__dirname, '../../uploads', folder);
  ensureDir(uploadPath);

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    }
  });
};

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan (JPEG, PNG, GIF, WEBP)'), false);
  }
};

// Upload configurations
const uploadConfig = {
  product: multer({
    storage: createStorage('produk'),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  }),

  payment: multer({
    storage: createStorage('bukti_pembayaran'),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  }),

  profile: multer({
    storage: createStorage('profil'),
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
  }),

  logo: multer({
    storage: createStorage('logo'),
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
  })
};

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Ukuran file terlalu besar' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = {
  uploadProduct: uploadConfig.product,
  uploadPayment: uploadConfig.payment,
  uploadProfile: uploadConfig.profile,
  uploadLogo: uploadConfig.logo,
  handleUploadError
};
