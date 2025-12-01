// ============================================================
// MODELS - ORDER MODEL
// src/models/order.js
// ============================================================

const pool = require('../config/database');

class OrderModel {
  // Create new order
  static async create(orderData) {
    const { user_id, produk_id, jumlah, alamat_pengiriman, ongkir = 0 } = orderData;

    // Get product price
    const [product] = await pool.execute('SELECT harga FROM produk WHERE id = ?', [produk_id]);
    if (!product.length) {
      throw new Error('Product not found');
    }

    const harga_satuan = product[0].harga;
    const subtotal = harga_satuan * jumlah;
    const total_harga = subtotal + parseFloat(ongkir);

    const query = `
      INSERT INTO pemesanan (user_id, produk_id, jumlah, harga_satuan, subtotal, ongkir, total_harga, alamat_pengiriman, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    const [result] = await pool.execute(query, [
      user_id,
      produk_id,
      jumlah,
      harga_satuan,
      subtotal,
      ongkir,
      total_harga,
      alamat_pengiriman
    ]);

    return {
      id: result.insertId,
      total_harga
    };
  }

  // Get order by ID
  static async getById(id) {
    const query = `
      SELECT p.*, pr.nama_produk, pr.gambar_produk, u.email, u.nama_lengkap
      FROM pemesanan p
      JOIN produk pr ON p.produk_id = pr.id
      JOIN user u ON p.user_id = u.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  // Get orders by user
  static async getByUser(userId) {
    const query = `
      SELECT p.*, pr.nama_produk, pr.gambar_produk
      FROM pemesanan p
      JOIN produk pr ON p.produk_id = pr.id
      WHERE p.user_id = ?
      ORDER BY p.tanggal_pesanan DESC
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  // Get all orders (Admin)
  static async getAll(status = null) {
    let query = `
      SELECT p.*, pr.nama_produk, pr.gambar_produk, u.email, u.nama_lengkap
      FROM pemesanan p
      JOIN produk pr ON p.produk_id = pr.id
      JOIN user u ON p.user_id = u.id
    `;
    let params = [];

    if (status) {
      query += ' WHERE p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.tanggal_pesanan DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Update order status
  static async updateStatus(id, status) {
    const validStatuses = ['Pending', 'Verifikasi', 'Proses', 'Terkirim', 'Selesai', 'Dibatalkan'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const query = 'UPDATE pemesanan SET status = ?, updated_at = NOW() WHERE id = ?';
    const [result] = await pool.execute(query, [status, id]);
    return result.affectedRows > 0;
  }

  // Get order statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_pesanan,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pesanan_pending,
        SUM(CASE WHEN status = 'Proses' THEN 1 ELSE 0 END) as pesanan_proses,
        SUM(CASE WHEN status = 'Terkirim' THEN 1 ELSE 0 END) as pesanan_terkirim,
        SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as pesanan_selesai,
        SUM(CASE WHEN status = 'Selesai' THEN total_harga ELSE 0 END) as total_pendapatan
      FROM pemesanan
    `;
    const [rows] = await pool.execute(query);
    return rows[0];
  }
}

module.exports = OrderModel;
