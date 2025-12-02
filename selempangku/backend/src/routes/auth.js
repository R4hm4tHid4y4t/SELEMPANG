// ============================================================
// ROUTES - AUTH ROUTES (FINAL FIXED VERSION)
// src/routes/auth.js
// ============================================================

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

// ============================================================
// USER AUTHENTICATION ROUTES
// ============================================================
router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/me", authenticate, authController.getCurrentUser);

// ============================================================
// ADMIN LOGIN — FINAL FIX
// ============================================================
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password diperlukan" });
    }

    // Cari admin dari tabel user
    const [rows] = await pool.execute(
      "SELECT * FROM user WHERE email = ? AND LOWER(role) = 'admin' LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Admin tidak ditemukan" });
    }

    const admin = rows[0];

    // Cek password bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ============================================================

module.exports = router;
