// ============================================================
// CONTROLLERS - BANK CONTROLLER
// src/controllers/bankController.js
// ============================================================

exports.getAll = async (req, res) => {
  try {
    const [banks] = await pool.execute(`
      SELECT * FROM rekening_bank WHERE status = 'Aktif'
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      message: 'Banks retrieved successfully',
      data: banks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get banks' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama_bank, nomor_rekening, nama_pemilik } = req.body;

    if (!nama_bank || !nomor_rekening || !nama_pemilik) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const [result] = await pool.execute(`
      INSERT INTO rekening_bank (nama_bank, nomor_rekening, nama_pemilik)
      VALUES (?, ?, ?)
    `, [nama_bank, nomor_rekening, nama_pemilik]);

    res.status(201).json({
      message: 'Bank account created successfully',
      bankId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create bank account' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_bank, nomor_rekening, nama_pemilik, status } = req.body;

    const [result] = await pool.execute(`
      UPDATE rekening_bank 
      SET nama_bank = ?, nomor_rekening = ?, nama_pemilik = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `, [nama_bank, nomor_rekening, nama_pemilik, status || 'Aktif', id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    res.status(200).json({ message: 'Bank account updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update bank account' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM rekening_bank WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    res.status(200).json({ message: 'Bank account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete bank account' });
  }
};