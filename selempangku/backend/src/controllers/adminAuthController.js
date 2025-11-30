// backend/src/controllers/adminAuthController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database'); // atau path koneksi MySQL-mu

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // hanya user dengan role Admin
    const [rows] = await pool.execute(
      'SELECT * FROM user WHERE email = ? AND role = "Admin" LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const token = jwt.sign(
      { id: admin.id, role: 'Admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login admin berhasil',
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        nama_lengkap: admin.nama_lengkap,
        role: 'Admin',
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};
