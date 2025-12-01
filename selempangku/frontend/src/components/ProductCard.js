// ============================================================
// PRODUCT CARD COMPONENT
// src/components/ProductCard.js
// ============================================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/helpers';

const ProductCard = ({ product, showOrderButton = true }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleOrder = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }
    navigate('/checkout', { state: { productId: product.id } });
  };

  const imageUrl = product.gambar_produk
    ? `http://localhost:5000/uploads/produk/${product.gambar_produk}`
    : null;

  const stockStatus = () => {
    if (product.stok === 0) {
      return { text: 'Habis', color: 'bg-red-500' };
    }
    if (product.stok <= 5) {
      return { text: 'Stok Terbatas', color: 'bg-yellow-500' };
    }
    return null;
  };

  const status = stockStatus();

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.nama_produk}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <span className="text-6xl">👗</span>
          </div>
        )}

        {/* Stock Badge */}
        {status && (
          <span className={`absolute top-3 right-3 ${status.color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
            {status.text}
          </span>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/product/${product.id}`}
            className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            Lihat Detail
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {product.nama_produk}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.deskripsi || 'Selempang custom berkualitas tinggi untuk berbagai kebutuhan acara.'}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(product.harga)}
          </span>
          {product.stok > 0 && product.stok <= 10 && (
            <span className="text-sm text-gray-500">
              Sisa {product.stok}
            </span>
          )}
        </div>

        {/* Actions */}
        {showOrderButton && (
          <div className="flex gap-2">
            <Link
              to={`/product/${product.id}`}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-center hover:bg-gray-200 transition text-sm font-medium"
            >
              Detail
            </Link>
            <button
              onClick={handleOrder}
              disabled={product.stok === 0}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {product.stok === 0 ? 'Habis' : 'Pesan'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
