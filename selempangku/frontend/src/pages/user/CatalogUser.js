// ============================================================
// CATALOG USER (Sudah Login)
// src/pages/user/CatalogUser.js
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const CatalogUser = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

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

  const handleOrder = (productId) => {
    navigate('/checkout', { state: { productId } });
  };

  const filteredProducts = products
    .filter(product =>
      product.nama_produk?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.harga - b.harga;
        case 'price-high':
          return b.harga - a.harga;
        case 'name':
          return a.nama_produk.localeCompare(b.nama_produk);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Katalog Produk</h1>
            <p className="text-gray-600">Halo {user?.nama_lengkap}, pilih selempang favoritmu!</p>
          </div>
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Lihat Pesanan Saya
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Terbaru</option>
            <option value="price-low">Harga Terendah</option>
            <option value="price-high">Harga Tertinggi</option>
            <option value="name">Nama A-Z</option>
          </select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                  {product.gambar_produk ? (
                    <img
                      src={`http://localhost:5000/uploads/produk/${product.gambar_produk}`}
                      alt={product.nama_produk}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">👗</span>
                  )}
                  {product.stok <= 5 && product.stok > 0 && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Stok Terbatas
                    </span>
                  )}
                  {product.stok === 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Habis
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {product.nama_produk}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.deskripsi || 'Selempang custom berkualitas tinggi'}
                  </p>
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {formatCurrency(product.harga)}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm text-center"
                    >
                      Detail
                    </Link>
                    <button
                      onClick={() => handleOrder(product.id)}
                      disabled={product.stok === 0}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Pesan
                    </button>
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

export default CatalogUser;
