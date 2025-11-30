// ============================================================
// MODELS - PRODUCT MODEL
// src/models/product.js
// ============================================================

const pool = require('../config/database');

class ProductModel {
  // Get all products
  static async getAll() {
    const query = `
      SELECT id, nama_produk, deskripsi, harga, gambar_produk, created_at 
      FROM produk 
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Get product by ID
  static async getById(id) {
    const query = `
      SELECT id, nama_produk, deskripsi, harga, gambar_produk 
      FROM produk 
      WHERE id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  // Create product
  static async create(productData) {
    const { nama_produk, deskripsi, harga, gambar_produk } = productData;
    
    const query = `
      INSERT INTO produk (nama_produk, deskripsi, harga, gambar_produk)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      nama_produk,
      deskripsi,
      harga,
      gambar_produk
    ]);
    
    return result.insertId;
  }

  // Update product
  static async update(id, productData) {
    const { nama_produk, deskripsi, harga, gambar_produk } = productData;
    
    const query = `
      UPDATE produk 
      SET nama_produk = ?, deskripsi = ?, harga = ?, 
          gambar_produk = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    const [result] = await pool.execute(query, [
      nama_produk,
      deskripsi,
      harga,
      gambar_produk,
      id
    ]);
    
    return result.affectedRows > 0;
  }

  // Delete product
  static async delete(id) {
    const query = 'DELETE FROM produk WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ProductModel;