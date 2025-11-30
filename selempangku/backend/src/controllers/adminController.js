// ============================================================
// CONTROLLERS - ADMIN CONTROLLER
// src/controllers/adminController.js
// ============================================================

exports.getDashboard = async (req, res) => {
  try {
    const [stats] = await pool.execute('SELECT * FROM v_dashboard_stats');

    res.status(200).json({
      message: 'Dashboard stats retrieved successfully',
      data: stats[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get dashboard stats' });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const [members] = await pool.execute(`
      SELECT id, email, username, nama_lengkap, nomor_telepon, role, created_at
      FROM user
      WHERE role = 'Customer'
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      message: 'Members retrieved successfully',
      data: members,
      total: members.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get members' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const [reports] = await pool.execute(`
      SELECT * FROM laporan_penjualan
      ORDER BY tanggal DESC
    `);

    res.status(200).json({
      message: 'Reports retrieved successfully',
      data: reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get reports' });
  }
};

exports.getDailyReport = async (req, res) => {
  try {
    const [reports] = await pool.execute(`
      SELECT DATE(tanggal_pesanan) as tanggal, COUNT(*) as jumlah_pesanan, SUM(total_harga) as total_pendapatan
      FROM pemesanan
      WHERE status = 'Selesai'
      GROUP BY DATE(tanggal_pesanan)
      ORDER BY tanggal DESC
      LIMIT 30
    `);

    res.status(200).json({
      message: 'Daily reports retrieved successfully',
      data: reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get daily reports' });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const [reports] = await pool.execute(`
      SELECT DATE_FORMAT(tanggal_pesanan, '%Y-%m') as bulan, COUNT(*) as jumlah_pesanan, SUM(total_harga) as total_pendapatan
      FROM pemesanan
      WHERE status = 'Selesai'
      GROUP BY DATE_FORMAT(tanggal_pesanan, '%Y-%m')
      ORDER BY bulan DESC
    `);

    res.status(200).json({
      message: 'Monthly reports retrieved successfully',
      data: reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get monthly reports' });
  }
};
