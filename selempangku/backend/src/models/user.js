// ============================================================
// MODELS - USER MODEL
// src/models/user.js
// ============================================================

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  // Create new user
  static async create(userData) {
    const { email, username, password, nama_lengkap, nomor_telepon, role = 'Customer' } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO user (email, username, password, nama_lengkap, nomor_telepon, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      email,
      username,
      hashedPassword,
      nama_lengkap || null,
      nomor_telepon || null,
      role
    ]);
    
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM user WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM user WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  // Update user
  static async update(id, userData) {
    const { nama_lengkap, nomor_telepon, alamat, jenis_kelamin, foto_profil } = userData;
    
    const query = `
      UPDATE user 
      SET nama_lengkap = ?, nomor_telepon = ?, alamat = ?, 
          jenis_kelamin = ?, foto_profil = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    const [result] = await pool.execute(query, [
      nama_lengkap,
      nomor_telepon,
      alamat,
      jenis_kelamin,
      foto_profil,
      id
    ]);
    
    return result.affectedRows > 0;
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE user SET password = ?, updated_at = NOW() WHERE id = ?';
    const [result] = await pool.execute(query, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  // Verify password
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Get all users (for admin)
  static async getAll(role = null) {
    let query = 'SELECT id, email, username, nama_lengkap, nomor_telepon, role, created_at FROM user';
    let params = [];
    
    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }
}

module.exports = UserModel;