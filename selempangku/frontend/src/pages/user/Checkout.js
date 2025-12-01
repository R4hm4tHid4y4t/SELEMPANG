import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/helpers';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const product = location.state?.product;
  
  const [formData, setFormData] = useState({
    jumlah: 1,
    alamat_pengiriman: user?.alamat || '',
    nama_selempang: '',
    gelar: '',
    kampus_sekolah: '',
    jurusan: '',
    tahun_tamat: ''
  });
  const [loading, setLoading] = useState(false);

  const ONGKIR = 15000;

  useEffect(() => {
    if (!product) {
      toast.error('Pilih produk terlebih dahulu');
      navigate('/catalog');
    }
  }, [product, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const subtotal = product ? product.harga * formData.jumlah : 0;
    return subtotal + ONGKIR;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.alamat_pengiriman.trim()) {
      toast.error('Alamat pengiriman harus diisi');
      return;
    }

    if (!formData.nama_selempang.trim()) {
      toast.error('Nama pada selempang harus diisi');
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        produk_id: product.id,
        jumlah: parseInt(formData.jumlah),
        alamat_pengiriman: formData.alamat_pengiriman,
        ongkir: ONGKIR,
        detail_pesanan: {
          nama_selempang: formData.nama_selempang,
          gelar: formData.gelar,
          kampus_sekolah: formData.kampus_sekolah,
          jurusan: formData.jurusan,
          tahun_tamat: formData.tahun_tamat
        }
      };

      const response = await orderService.create(orderData);
      const orderId = response.data.data?.id || response.data.id;
      
      toast.success('Pesanan berhasil dibuat!');
      navigate(`/payment/${orderId}`, { 
        state: { 
          order: response.data.data || response.data,
          product 
        } 
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to={`/product/${product.id}`} className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Kembali ke Detail Produk
        </Link>

        <h1 className="text-3xl font-bold mb-8">Form Pemesanan</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Detail Selempang */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Detail Selempang</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama pada Selempang *
                    </label>
                    <input
                      type="text"
                      name="nama_selempang"
                      value={formData.nama_selempang}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: WISUDAWAN TERBAIK"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gelar
                    </label>
                    <input
                      type="text"
                      name="gelar"
                      value={formData.gelar}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: S.Kom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kampus / Sekolah
                    </label>
                    <input
                      type="text"
                      name="kampus_sekolah"
                      value={formData.kampus_sekolah}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Universitas Indonesia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jurusan / Program Studi
                    </label>
                    <input
                      type="text"
                      name="jurusan"
                      value={formData.jurusan}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Teknik Informatika"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tahun Tamat
                    </label>
                    <input
                      type="text"
                      name="tahun_tamat"
                      value={formData.tahun_tamat}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 2025"
                    />
                  </div>
                </div>
              </div>

              {/* Jumlah */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Jumlah Pesanan</h2>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, jumlah: Math.max(1, prev.jumlah - 1) }))}
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-xl"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    min="1"
                    className="w-20 text-center px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, jumlah: prev.jumlah + 1 }))}
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Alamat Pengiriman */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Alamat Pengiriman</h2>
                <textarea
                  name="alamat_pengiriman"
                  value={formData.alamat_pengiriman}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat lengkap pengiriman"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Memproses...' : 'Lanjut ke Pembayaran'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
              
              <div className="flex items-center space-x-4 mb-4 pb-4 border-b">
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                  {product.gambar_produk ? (
                    <img
                      src={`http://localhost:5000/uploads/produk/${product.gambar_produk}`}
                      alt={product.nama_produk}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-3xl">👗</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{product.nama_produk}</h3>
                  <p className="text-blue-600">{formatCurrency(product.harga)}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({formData.jumlah} item)</span>
                  <span>{formatCurrency(product.harga * formData.jumlah)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span>{formatCurrency(ONGKIR)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
