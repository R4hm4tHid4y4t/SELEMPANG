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
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Server error" });

    if (result.length === 0) {
      return res.status(401).json({ msg: "Admin tidak ditemukan" });
    }

    const admin = result[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Password salah" });
    }

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      msg: "Login berhasil",
      token,
      role: "admin"
    });
  });
});

module.exports = router;

