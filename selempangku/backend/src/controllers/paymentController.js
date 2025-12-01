// ============================================================
// CONTROLLERS - PAYMENT CONTROLLER
// src/controllers/paymentController.js
// ============================================================

const pool = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { pesanan_id, metode_pembayaran, bank_pengirim, nomor_rekening, jumlah_transfer } = req.body;
    const userId = req.userId;

    if (!pesanan_id || !metode_pembayaran || !jumlah_transfer) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Verify order belongs to user
    const [order] = await pool.execute(
      'SELECT * FROM pemesanan WHERE id = ? AND user_id = ?',
      [pesanan_id, userId]
    );

    if (!order.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Handle file upload
    let bukti_pembayaran = null;
    if (req.file) {
      bukti_pembayaran = req.file.filename;
    }

    // Create payment
    const [result] = await pool.execute(`
      INSERT INTO pembayaran (pesanan_id, metode_pembayaran, bank_pengirim, nomor_rekening, jumlah_transfer, bukti_pembayaran, status_pembayaran)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `, [pesanan_id, metode_pembayaran, bank_pengirim, nomor_rekening, jumlah_transfer, bukti_pembayaran]);

    // Update order status to Verifikasi
    await pool.execute(
      'UPDATE pemesanan SET status = ? WHERE id = ?',
      ['Verifikasi', pesanan_id]
    );

    res.status(201).json({
      message: 'Payment submitted successfully',
      paymentId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit payment' });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const userId = req.userId;

    const [payments] = await pool.execute(`
      SELECT pb.*, p.nomor_pesanan, pr.nama_produk
      FROM pembayaran pb
      JOIN pemesanan p ON pb.pesanan_id = p.id
      JOIN produk pr ON p.produk_id = pr.id
      WHERE p.user_id = ?
      ORDER BY pb.tanggal_pembayaran DESC
    `, [userId]);

    res.status(200).json({
      message: 'Payments retrieved successfully',
      data: payments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get payments' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [payments] = await pool.execute(`
      SELECT pb.*, p.nomor_pesanan, u.email, u.nama_lengkap, pr.nama_produk
      FROM pembayaran pb
      JOIN pemesanan p ON pb.pesanan_id = p.id
      JOIN user u ON p.user_id = u.id
      JOIN produk pr ON p.produk_id = pr.id
      ORDER BY pb.tanggal_pembayaran DESC
    `);

    res.status(200).json({
      message: 'All payments retrieved successfully',
      data: payments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get payments' });
  }
};

exports.verify = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;

    const validStatuses = ['Terverifikasi', 'Ditolak'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Get payment info
    const [payment] = await pool.execute(
      'SELECT pesanan_id FROM pembayaran WHERE id = ?',
      [id]
    );

    if (!payment.length) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment
    await pool.execute(
      'UPDATE pembayaran SET status_pembayaran = ?, catatan = ?, tanggal_verifikasi = NOW() WHERE id = ?',
      [status, catatan || null, id]
    );

    // Update order status if verified
    if (status === 'Terverifikasi') {
      await pool.execute(
        'UPDATE pemesanan SET status = ? WHERE id = ?',
        ['Proses', payment[0].pesanan_id]
      );
    }

    res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};