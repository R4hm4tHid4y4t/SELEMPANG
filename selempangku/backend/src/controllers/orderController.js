// ============================================================
// CONTROLLERS - ORDER CONTROLLER
// src/controllers/orderController.js
// ============================================================

const pool = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { produk_id, jumlah, alamat_pengiriman, ongkir } = req.body;
    const userId = req.userId;

    if (!produk_id || !jumlah || !alamat_pengiriman) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Get product price
    const [product] = await pool.execute('SELECT harga FROM produk WHERE id = ?', [produk_id]);
    if (!product.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate totals
    const harga_satuan = product[0].harga;
    const subtotal = harga_satuan * jumlah;
    const total_harga = subtotal + (ongkir || 0);

    // Create order
    const [result] = await pool.execute(`
      INSERT INTO pemesanan (user_id, produk_id, jumlah, harga_satuan, subtotal, ongkir, total_harga, alamat_pengiriman, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `, [userId, produk_id, jumlah, harga_satuan, subtotal, ongkir || 0, total_harga, alamat_pengiriman]);

    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertId,
      total_harga: total_harga
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const userId = req.userId;

    const [orders] = await pool.execute(`
      SELECT p.*, pr.nama_produk, pr.gambar_produk
      FROM pemesanan p
      JOIN produk pr ON p.produk_id = pr.id
      WHERE p.user_id = ?
      ORDER BY p.tanggal_pesanan DESC
    `, [userId]);

    res.status(200).json({
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get orders' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const [orders] = await pool.execute(`
      SELECT p.*, pr.nama_produk, pr.gambar_produk
      FROM pemesanan p
      JOIN produk pr ON p.produk_id = pr.id
      WHERE p.id = ? AND p.user_id = ?
    `, [id, userId]);

    if (!orders.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order retrieved successfully',
      data: orders[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get order' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [orders] = await pool.execute(`
      SELECT p.*, u.email, u.nama_lengkap, pr.nama_produk
      FROM pemesanan p
      JOIN user u ON p.user_id = u.id
      JOIN produk pr ON p.produk_id = pr.id
      ORDER BY p.tanggal_pesanan DESC
    `);

    res.status(200).json({
      message: 'All orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get orders' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Verifikasi', 'Proses', 'Terkirim', 'Selesai', 'Dibatalkan'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const [result] = await pool.execute(
      'UPDATE pemesanan SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};