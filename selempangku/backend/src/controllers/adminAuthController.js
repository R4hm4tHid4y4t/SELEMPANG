// backend/src/controllers/adminAuthController.js
const bcrypt = require('bcryptjs');
const pool = require('../config/database'); // sesuaikan path koneksi DB jika berbeda
const { generateToken } = require('../utils/jwt');

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ambil user yang punya role Admin (sesuaikan nama tabel/kolom jika beda)
    const [rows] = await pool.execute(
      'SELECT * FROM `user` WHERE email = ? AND role = "Admin" LIMIT 1',
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: 'Admin tidak ditemukan' });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // Gunakan helper generateToken agar payload konsisten ({ userId, role })
    const token = generateToken(admin.id, 'Admin', '1d');

    // Kembalikan user minimal + token
    res.json({
      message: 'Login admin berhasil',
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username || null,
        nama_lengkap: admin.nama_lengkap || null,
        role: 'Admin'
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};
