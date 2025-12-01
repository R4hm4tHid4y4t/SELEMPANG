// ============================================================
// ORDER FORM
// src/pages/user/OrderForm.js
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-toastify';

const OrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    produk_id: location.state?.productId || '',
    jumlah: 1,
    nama_selempang: '',
    catatan: '',
    alamat_pengiriman: user?.alamat || ''
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (formData.produk_id && products.length > 0) {
      const product = products.find(p => p.id === parseInt(formData.produk_id));
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  }, [formData.produk_id, products]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      const data = response.data.data || response.data || [];
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products');
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    return selectedProduct.harga * formData.jumlah;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.produk_id) {
      toast.error('Pilih produk terlebih dahulu');
      return;
    }

    if (!formData.nama_selempang.trim()) {
      toast.error('Masukkan nama untuk selempang');
      return;
    }

    if (!formData.alamat_pengiriman.trim()) {
      toast.error('Masukkan alamat pengiriman');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        produk_id: parseInt(formData.produk_id),
        jumlah: parseInt(formData.jumlah),
        nama_selempang: formData.nama_selempang,
        catatan: formData.catatan,
        alamat_pengiriman: formData.alamat_pengiriman,
        total_bayar: calculateTotal()
      };

      const response = await orderService.create(orderData);
      const orderId = response.data.data?.id || response.data.id;

      toast.success('Pesanan berhasil dibuat!');
      navigate(`/payment/${orderId}`);
    } catch (error) {
      console.error('Order failed:', error);
      toast.error(error.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <h1 className="text-2xl font-bold">Form Pemesanan</h1>
            <p className="text-blue-100 mt-1">Isi detail pesanan selempang Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Produk <span className="text-red-500">*</span>
              </label>
              <select
                name="produk_id"
                value={formData.produk_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Pilih Produk --</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.nama_produk} - {formatCurrency(product.harga)}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Product Preview */}
            {selectedProduct && (
              <div className="bg-blue-50 rounded-xl p-4 flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {selectedProduct.gambar_produk ? (
                    <img
                      src={`http://localhost:5000/uploads/produk/${selectedProduct.gambar_produk}`}
                      alt={selectedProduct.nama_produk}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">👗</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedProduct.nama_produk}</h3>
                  <p className="text-blue-600 font-bold">{formatCurrency(selectedProduct.harga)}</p>
                  <p className="text-gray-500 text-sm">{selectedProduct.deskripsi}</p>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="jumlah"
                value={formData.jumlah}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Nama Selempang */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama/Teks pada Selempang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_selempang"
                value={formData.nama_selempang}
                onChange={handleChange}
                placeholder="Contoh: Wisudawan Terbaik 2025"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-gray-500 text-sm mt-1">Teks yang akan dicetak pada selempang</p>
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Tambahan
              </label>
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                rows="3"
                placeholder="Catatan khusus untuk pesanan Anda (opsional)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Alamat Pengiriman */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Pengiriman <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alamat_pengiriman"
                value={formData.alamat_pengiriman}
                onChange={handleChange}
                rows="3"
                placeholder="Masukkan alamat lengkap pengiriman"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Ringkasan Pesanan</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Produk</span>
                <span>{selectedProduct?.nama_produk || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Harga Satuan</span>
                <span>{selectedProduct ? formatCurrency(selectedProduct.harga) : '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Jumlah</span>
                <span>{formData.jumlah}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !selectedProduct}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Memproses...
                </span>
              ) : (
                'Buat Pesanan'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
