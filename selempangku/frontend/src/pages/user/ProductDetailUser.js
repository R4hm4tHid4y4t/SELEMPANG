// ============================================================
// PRODUCT DETAIL USER (Sudah Login)
// src/pages/user/ProductDetailUser.js
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const ProductDetailUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(id);
        setProduct(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleOrder = () => {
    navigate('/checkout', { 
      state: { 
        productId: product.id,
        quantity 
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h2>
          <Link to="/catalog" className="text-blue-600 hover:underline">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-blue-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/catalog" className="text-gray-500 hover:text-blue-600">Katalog</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.nama_produk}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="h-80 md:h-full bg-gray-200 flex items-center justify-center">
              {product.gambar_produk ? (
                <img
                  src={`http://localhost:5000/uploads/produk/${product.gambar_produk}`}
                  alt={product.nama_produk}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">👗</span>
              )}
            </div>

            {/* Details */}
            <div className="p-8">
              <div className="mb-4">
                <span className="text-sm text-gray-500">Hai, {user?.nama_lengkap}!</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.nama_produk}
              </h1>

              <div className="text-3xl font-bold text-blue-600 mb-6">
                {formatCurrency(product.harga)}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Deskripsi</h3>
                <p className="text-gray-700">
                  {product.deskripsi || 'Selempang custom berkualitas tinggi untuk berbagai kebutuhan acara.'}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Stok</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  product.stok > 10 
                    ? 'bg-green-100 text-green-800' 
                    : product.stok > 0 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {product.stok > 10 ? 'Tersedia' : product.stok > 0 ? `Sisa ${product.stok}` : 'Habis'}
                </span>
              </div>

              {/* Quantity */}
              {product.stok > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Jumlah</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stok, quantity + 1))}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Subtotal */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(product.harga * quantity)}
                  </span>
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={handleOrder}
                disabled={product.stok === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition mb-4"
              >
                {product.stok === 0 ? 'Stok Habis' : 'Pesan Sekarang'}
              </button>

              <Link
                to="/catalog"
                className="block text-center text-gray-600 hover:text-blue-600"
              >
                ← Kembali ke Katalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailUser;
