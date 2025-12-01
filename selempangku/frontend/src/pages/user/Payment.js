import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { paymentService } from '../../services/paymentService';
import { bankService } from '../../services/bankService';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [formData, setFormData] = useState({
    metode_pembayaran: 'Transfer Bank',
    bank_pengirim: '',
    nomor_rekening: '',
    bukti_pembayaran: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(!order);

  useEffect(() => {
    fetchBanks();
    if (!order) {
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoadingOrder(true);
      const response = await orderService.getById(orderId);
      setOrder(response.data.data);
    } catch (error) {
      toast.error('Pesanan tidak ditemukan');
      navigate('/orders');
    } finally {
      setLoadingOrder(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await bankService.getAll();
      const activeBanks = (response.data.data || response.data).filter(b => b.status === 'Aktif');
      setBanks(activeBanks);
      if (activeBanks.length > 0) {
        setSelectedBank(activeBanks[0]);
      }
    } catch (error) {
      toast.error('Gagal memuat data rekening bank');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Format file harus JPG atau PNG');
        return;
      }
      setFormData(prev => ({ ...prev, bukti_pembayaran: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bukti_pembayaran) {
      toast.error('Upload bukti pembayaran');
      return;
    }

    if (!formData.bank_pengirim.trim()) {
      toast.error('Nama bank pengirim harus diisi');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('pesanan_id', orderId);
      data.append('metode_pembayaran', formData.metode_pembayaran);
      data.append('bank_pengirim', formData.bank_pengirim);
      data.append('nomor_rekening', formData.nomor_rekening);
      data.append('jumlah_transfer', order.total_harga);
      data.append('bukti_pembayaran', formData.bukti_pembayaran);

      await paymentService.create(data);
      toast.success('Bukti pembayaran berhasil diupload. Menunggu verifikasi admin.');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupload bukti pembayaran');
    } finally {
      setLoading(false);
    }
  };

  if (loadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Pembayaran</h1>
        <p className="text-gray-600 mb-8">Nomor Pesanan: <strong>{order.nomor_pesanan}</strong></p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Bank Info */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Transfer ke Rekening</h2>
              
              {banks.length > 0 ? (
                <div className="space-y-4">
                  {banks.map((bank) => (
                    <div
                      key={bank.id}
                      onClick={() => setSelectedBank(bank)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedBank?.id === bank.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-lg">{bank.nama_bank}</div>
                      <div className="text-2xl font-bold text-blue-600 my-2">
                        {bank.nomor_rekening}
                      </div>
                      <div className="text-gray-600">a.n. {bank.nama_pemilik}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Tidak ada rekening bank tersedia</p>
              )}

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Penting:</strong> Transfer sesuai dengan total tagihan agar pembayaran dapat diverifikasi dengan cepat.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Detail Pesanan</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Produk</span>
                  <span>{order.produk?.nama_produk || 'Selempang'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah</span>
                  <span>{order.jumlah} pcs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span>{formatCurrency(order.ongkir)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t font-bold text-lg">
                  <span>Total Pembayaran</span>
                  <span className="text-blue-600">{formatCurrency(order.total_harga)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Bukti Pembayaran</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Pengirim *
                  </label>
                  <input
                    type="text"
                    name="bank_pengirim"
                    value={formData.bank_pengirim}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: BCA, Mandiri, BNI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Rekening Pengirim
                  </label>
                  <input
                    type="text"
                    name="nomor_rekening"
                    value={formData.nomor_rekening}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Opsional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bukti Transfer *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {preview ? (
                      <div className="space-y-4">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreview(null);
                            setFormData(prev => ({ ...prev, bukti_pembayaran: null }));
                          }}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Hapus gambar
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handleFileChange}
                          className="hidden"
                          id="bukti-upload"
                        />
                        <label
                          htmlFor="bukti-upload"
                          className="cursor-pointer"
                        >
                          <div className="text-4xl mb-2">📷</div>
                          <p className="text-gray-600 mb-2">
                            Klik untuk upload bukti transfer
                          </p>
                          <p className="text-gray-400 text-sm">
                            Format: JPG, PNG (Max 5MB)
                          </p>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Mengupload...' : 'Konfirmasi Pembayaran'}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <Link to="/orders" className="text-blue-600 hover:underline">
                Bayar Nanti &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
