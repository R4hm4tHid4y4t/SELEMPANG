import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/helpers';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getByUser();
      setOrders(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Gagal memuat riwayat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'Pending': 'Menunggu Pembayaran',
      'Verifikasi': 'Menunggu Verifikasi',
      'Proses': 'Sedang Diproses',
      'Terkirim': 'Dalam Pengiriman',
      'Selesai': 'Selesai',
      'Dibatalkan': 'Dibatalkan'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Riwayat Pesanan</h1>
          <Link
            to="/catalog"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + Pesanan Baru
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold mb-2">Belum ada pesanan</h2>
            <p className="text-gray-600 mb-6">
              Anda belum memiliki riwayat pesanan. Mulai pesan selempang sekarang!
            </p>
            <Link
              to="/catalog"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Lihat Katalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">{order.nomor_pesanan}</span>
                    <span className="text-gray-500 text-sm">
                      {formatDate(order.tanggal_pesanan || order.created_at)}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      {order.produk?.gambar_produk ? (
                        <img
                          src={`http://localhost:5000/uploads/produk/${order.produk.gambar_produk}`}
                          alt={order.produk?.nama_produk}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span className="text-3xl">👗</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {order.produk?.nama_produk || 'Selempang Custom'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {order.jumlah} pcs x {formatCurrency(order.harga_satuan)}
                      </p>
                      {order.detail_pesanan && (
                        <p className="text-gray-500 text-sm mt-1">
                          "{order.detail_pesanan.nama_selempang}"
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(order.total_harga)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {selectedOrder?.id === order.id ? 'Tutup Detail' : 'Lihat Detail'}
                    </button>
                    <div className="space-x-3">
                      {order.status === 'Pending' && (
                        <Link
                          to={`/payment/${order.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          Bayar Sekarang
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Detail Expanded */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-4 pt-4 border-t bg-gray-50 -mx-4 -mb-4 p-4">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">Detail Selempang</h4>
                          <div className="space-y-1 text-gray-600">
                            {order.detail_pesanan?.nama_selempang && (
                              <p>Nama: {order.detail_pesanan.nama_selempang}</p>
                            )}
                            {order.detail_pesanan?.gelar && (
                              <p>Gelar: {order.detail_pesanan.gelar}</p>
                            )}
                            {order.detail_pesanan?.kampus_sekolah && (
                              <p>Kampus: {order.detail_pesanan.kampus_sekolah}</p>
                            )}
                            {order.detail_pesanan?.jurusan && (
                              <p>Jurusan: {order.detail_pesanan.jurusan}</p>
                            )}
                            {order.detail_pesanan?.tahun_tamat && (
                              <p>Tahun: {order.detail_pesanan.tahun_tamat}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Alamat Pengiriman</h4>
                          <p className="text-gray-600">{order.alamat_pengiriman}</p>
                          
                          <h4 className="font-semibold mb-2 mt-4">Rincian Biaya</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Ongkir</span>
                              <span>{formatCurrency(order.ongkir)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900">
                              <span>Total</span>
                              <span>{formatCurrency(order.total_harga)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
