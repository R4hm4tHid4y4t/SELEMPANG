// ============================================================
// CONTROLLERS - PRODUCT CONTROLLER
// src/controllers/productController.js
// ============================================================

const ProductModel = require('../models/product');
const fs = require('fs');
const path = require('path');

// Get all products
exports.getAll = async (req, res) => {
  try {
    const products = await ProductModel.getAll();
    res.status(200).json({ 
      message: 'Products retrieved successfully',
      data: products 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get products' });
  }
};

// Get product by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.getById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ 
      message: 'Product retrieved successfully',
      data: product 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get product' });
  }
};

// Create product (Admin only)
exports.create = async (req, res) => {
  try {
    const { nama_produk, deskripsi, harga } = req.body;

    if (!nama_produk || !harga) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    // Handle file upload
    let gambar_produk = null;
    if (req.file) {
      gambar_produk = req.file.filename;
    }

    const productData = {
      nama_produk,
      deskripsi,
      harga: parseFloat(harga),
      gambar_produk
    };

    const productId = await ProductModel.create(productData);

    res.status(201).json({ 
      message: 'Product created successfully',
      productId: productId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// Update product (Admin only)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, deskripsi, harga } = req.body;

    if (!nama_produk || !harga) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    const product = await ProductModel.getById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle file upload
    let gambar_produk = product.gambar_produk;
    if (req.file) {
      // Delete old file
      if (product.gambar_produk) {
        const oldFilePath = path.join(__dirname, '../../uploads/produk', product.gambar_produk);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      gambar_produk = req.file.filename;
    }

    const productData = {
      nama_produk,
      deskripsi,
      harga: parseFloat(harga),
      gambar_produk
    };

    await ProductModel.update(id, productData);

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete product (Admin only)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.getById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete file
    if (product.gambar_produk) {
      const filePath = path.join(__dirname, '../../uploads/produk', product.gambar_produk);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await ProductModel.delete(id);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
