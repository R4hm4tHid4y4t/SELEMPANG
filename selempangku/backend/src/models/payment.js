// ============================================================
// MODELS - PAYMENT MODEL
// src/models/payment.js
// ============================================================

const pool = require('../config/database');

class PaymentModel {
  // Create new payment
  static async create(paymentData) {
    const { 
      pesanan_id, 
      metode_pembayaran, 
      bank_pengirim, 
      nomor_rekening, 
      jumlah_transfer, 
      bukti_pembayaran 
    } = paymentData;

    const query = `
      INSERT INTO pembayaran (pesanan_id, metode_pembayaran, bank_pengirim, nomor_rekening, jumlah_transfer, bukti_pembayaran, status_pembayaran)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `;

    const [result] = await pool.execute(query, [
      pesanan_id,
      metode_pembayaran,
      bank_pengirim || null,
      nomor_rekening || null,
      jumlah_transfer,
      bukti_pembayaran || null
    ]);

    return result.insertId;
  }

  // Get payment by ID
  static async getById(id) {
    const query = `
      SELECT pb.*, p.nomor_pesanan, p.total_harga, u.email, u.nama_lengkap
      FROM pembayaran pb
      JOIN pemesanan p ON pb.pesanan_id = p.id
      JOIN user u ON p.user_id = u.id
      WHERE pb.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  // Get payment by order ID
  static async getByOrderId(pesananId) {
    const query = `
      SELECT * FROM pembayaran 
      WHERE pesanan_id = ?
      ORDER BY tanggal_pembayaran DESC
    `;
    const [rows] = await pool.execute(query, [pesananId]);
    return rows;
  }

  // Get payments by user
  static async getByUser(userId) {
    const query = `
      SELECT pb.*, p.nomor_pesanan, pr.nama_produk
      FROM pembayaran pb
      JOIN pemesanan p ON pb.pesanan_id = p.id
      JOIN produk pr ON p.produk_id = pr.id
      WHERE p.user_id = ?
      ORDER BY pb.tanggal_pembayaran DESC
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  // Get all payments (Admin)
  static async getAll(status = null) {
    let query = `
      SELECT pb.*, p.nomor_pesanan, p.total_harga, u.email, u.nama_lengkap, pr.nama_produk
      FROM pembayaran pb
      JOIN pemesanan p ON pb.pesanan_id = p.id
      JOIN user u ON p.user_id = u.id
      JOIN produk pr ON p.produk_id = pr.id
    `;
    let params = [];

    if (status) {
      query += ' WHERE pb.status_pembayaran = ?';
      params.push(status);
    }

    query += ' ORDER BY pb.tanggal_pembayaran DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Verify payment
  static async verify(id, status, catatan = null) {
    const validStatuses = ['Terverifikasi', 'Ditolak'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const query = `
      UPDATE pembayaran 
      SET status_pembayaran = ?, catatan = ?, tanggal_verifikasi = NOW()
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [status, catatan, id]);
    return result.affectedRows > 0;
  }

  // Get pending payments count
  static async getPendingCount() {
    const query = `
      SELECT COUNT(*) as count FROM pembayaran WHERE status_pembayaran = 'Pending'
    `;
    const [rows] = await pool.execute(query);
    return rows[0].count;
  }
}

module.exports = PaymentModel;
