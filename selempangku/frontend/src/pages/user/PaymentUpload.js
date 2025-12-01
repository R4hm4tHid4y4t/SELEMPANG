// ============================================================
// PAYMENT UPLOAD
// src/pages/user/PaymentUpload.js
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { bankService } from '../../services/bankService';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-toastify';

const PaymentUpload = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    rekening_id: '',
    bukti_pembayaran: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orderRes, bankRes] = await Promise.all([
          orderService.getById(orderId),
          bankService.getAll()
        ]);

        setOrder(orderRes.data.data || orderRes.data);
        setBanks(bankRes.data.data || bankRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Gagal memuat data pesanan');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [orderId]);



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Format file harus JPG, JPEG, atau PNG');
        return;
      }

      setFormData(prev => ({ ...prev, bukti_pembayaran: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rekening_id) {
      toast.error('Pilih rekening tujuan pembayaran');
      return;
    }

    if (!formData.bukti_pembayaran) {
      toast.error('Upload bukti pembayaran');
      return;
    }

    setUploading(true);

    try {
      const submitData = new FormData();
      submitData.append('pesanan_id', orderId);
      submitData.append('rekening_id', formData.rekening_id);
      submitData.append('bukti_pembayaran', formData.bukti_pembayaran);

      await paymentService.uploadProof(submitData);

      toast.success('Bukti pembayaran berhasil diupload!');
      navigate('/orders');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.message || 'Gagal upload bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-4">Pesanan dengan ID tersebut tidak ditemukan</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Kembali ke Pesanan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
            <h1 className="text-2xl font-bold">Upload Bukti Pembayaran</h1>
            <p className="text-green-100 mt-1">Pesanan #{orderId}</p>
          </div>

          {/* Order Summary */}
          <div className="p-6 border-b">
            <h2 className="font-semibold text-gray-900 mb-4">Detail Pesanan</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Produk</span>
                <span>{order.nama_produk || order.produk?.nama_produk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah</span>
                <span>{order.jumlah} pcs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nama Selempang</span>
                <span>{order.nama_selempang}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Bayar</span>
                <span className="text-green-600">{formatCurrency(order.total_bayar)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Rekening Tujuan <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {banks.map(bank => (
                  <label
                    key={bank.id}
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition ${
                      formData.rekening_id === bank.id.toString()
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rekening_id"
                      value={bank.id}
                      checked={formData.rekening_id === bank.id.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, rekening_id: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900">{bank.nama_bank}</div>
                        <div className="text-gray-600">{bank.nomor_rekening}</div>
                        <div className="text-gray-500 text-sm">a.n. {bank.atas_nama}</div>
                      </div>
                      {formData.rekening_id === bank.id.toString() && (
                        <div className="text-green-600">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bukti Pembayaran <span className="text-red-500">*</span>
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                {previewImage ? (
                  <div className="space-y-4">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData(prev => ({ ...prev, bukti_pembayaran: null }));
                      }}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Hapus & Pilih Ulang
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-4">📷</div>
                    <p className="text-gray-600 mb-2">Klik untuk upload bukti pembayaran</p>
                    <p className="text-gray-400 text-sm">JPG, JPEG, PNG (max 5MB)</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                {!previewImage && (
                  <label
                    htmlFor="file-upload"
                    className="mt-4 inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                  >
                    Pilih File
                  </label>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex gap-3">
                <span className="text-yellow-600 text-xl">⚠️</span>
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Perhatian</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pastikan bukti pembayaran jelas dan terbaca</li>
                    <li>Transfer sesuai dengan nominal total bayar</li>
                    <li>Pembayaran akan diverifikasi dalam 1x24 jam</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !formData.rekening_id || !formData.bukti_pembayaran}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Mengupload...
                </span>
              ) : (
                'Kirim Bukti Pembayaran'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentUpload;
