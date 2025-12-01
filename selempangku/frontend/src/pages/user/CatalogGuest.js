// ============================================================
// CATALOG GUEST (Tanpa Login)
// src/pages/user/CatalogGuest.js
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/helpers';

const CatalogGuest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      const data = response.data.data || response.data || [];
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.nama_produk?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Produk</h1>
          <p className="text-gray-600">Jelajahi koleksi selempang berkualitas kami</p>
        </div>

        {/* Info Login */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-blue-600 text-xl">ℹ️</span>
            <span className="text-blue-800">Silakan login untuk dapat memesan produk</span>
          </div>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Login Sekarang
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {product.gambar_produk ? (
                    <img
                      src={`http://localhost:5000/uploads/produk/${product.gambar_produk}`}
                      alt={product.nama_produk}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">👗</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {product.nama_produk}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.deskripsi || 'Selempang custom berkualitas tinggi'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(product.harga)}
                    </span>
                    <Link
                      to={`/product/${product.id}`}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500">
              {searchTerm ? 'Tidak ada produk yang sesuai' : 'Belum ada produk tersedia'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogGuest;
