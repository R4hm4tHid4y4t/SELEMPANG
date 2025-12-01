// ============================================================
// MODELS - BANK MODEL
// src/models/bank.js
// ============================================================

const pool = require('../config/database');

class BankModel {
  // Get all active banks
  static async getAll(status = 'Aktif') {
    let query = 'SELECT * FROM rekening_bank';
    let params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Get bank by ID
  static async getById(id) {
    const query = 'SELECT * FROM rekening_bank WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  // Create bank account
  static async create(bankData) {
    const { nama_bank, nomor_rekening, nama_pemilik, status = 'Aktif' } = bankData;

    const query = `
      INSERT INTO rekening_bank (nama_bank, nomor_rekening, nama_pemilik, status)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      nama_bank,
      nomor_rekening,
      nama_pemilik,
      status
    ]);

    return result.insertId;
  }

  // Update bank account
  static async update(id, bankData) {
    const { nama_bank, nomor_rekening, nama_pemilik, status } = bankData;

    const query = `
      UPDATE rekening_bank 
      SET nama_bank = ?, nomor_rekening = ?, nama_pemilik = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const [result] = await pool.execute(query, [
      nama_bank,
      nomor_rekening,
      nama_pemilik,
      status || 'Aktif',
      id
    ]);

    return result.affectedRows > 0;
  }

  // Delete bank account
  static async delete(id) {
    const query = 'DELETE FROM rekening_bank WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Toggle status
  static async toggleStatus(id) {
    const bank = await this.getById(id);
    if (!bank) return false;

    const newStatus = bank.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    const query = 'UPDATE rekening_bank SET status = ?, updated_at = NOW() WHERE id = ?';
    const [result] = await pool.execute(query, [newStatus, id]);
    return result.affectedRows > 0;
  }
}

module.exports = BankModel;
