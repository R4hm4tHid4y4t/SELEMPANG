import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/helpers';
import { FiFilter, FiEye, FiX } from 'react-icons/fi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAll();
      setOrders(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Gagal memuat data pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      toast.success(`Status pesanan diubah menjadi ${status}`);
      fetchOrders();
      
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
    } catch (error) {
      toast.error('Gagal mengubah status pesanan');
    }
  };

  const openDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const statusOptions = ['Pending', 'Verifikasi', 'Proses', 'Terkirim', 'Selesai', 'Dibatalkan'];

  const getNextStatus = (currentStatus) => {
    const flow = {
      'Pending': 'Verifikasi',
      'Verifikasi': 'Proses',
      'Proses': 'Terkirim',
      'Terkirim': 'Selesai'
    };
    return flow[currentStatus];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Pesanan</h1>
        <div className="flex items-center space-x-2">
          <FiFilter className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            {statusOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  No. Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {order.nomor_pesanan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.user?.nama_lengkap || order.customer_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium">{order.produk?.nama_produk || 'Selempang'}</p>
                      <p className="text-sm text-gray-500">{order.jumlah} pcs</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {formatCurrency(order.total_harga)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.tanggal_pesanan || order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => openDetail(order)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Lihat Detail"
                    >
                      <FiEye size={18} />
                    </button>
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, getNextStatus(order.status))}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                        title={`Ubah ke ${getNextStatus(order.status)}`}
                      >
                        &rarr; {getNextStatus(order.status)}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada pesanan
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">Detail Pesanan</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-4">
              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">No. Pesanan</p>
                  <p className="font-semibold">{selectedOrder.nomor_pesanan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-semibold">{selectedOrder.user?.nama_lengkap || '-'}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Pesanan</p>
                  <p className="font-semibold">
                    {formatDate(selectedOrder.tanggal_pesanan || selectedOrder.created_at)}
                  </p>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">Produk</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    {selectedOrder.produk?.gambar_produk ? (
                      <img
                        src={`http://localhost:5000/uploads/produk/${selectedOrder.produk.gambar_produk}`}
                        alt={selectedOrder.produk?.nama_produk}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-2xl">👗</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedOrder.produk?.nama_produk || 'Selempang'}</p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.jumlah} x {formatCurrency(selectedOrder.harga_satuan)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail Selempang */}
              {selectedOrder.detail_pesanan && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Detail Selempang</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedOrder.detail_pesanan.nama_selempang && (
                      <div>
                        <span className="text-gray-500">Nama:</span>{' '}
                        <span className="font-medium">{selectedOrder.detail_pesanan.nama_selempang}</span>
                      </div>
                    )}
                    {selectedOrder.detail_pesanan.gelar && (
                      <div>
                        <span className="text-gray-500">Gelar:</span>{' '}
                        <span className="font-medium">{selectedOrder.detail_pesanan.gelar}</span>
                      </div>
                    )}
                    {selectedOrder.detail_pesanan.kampus_sekolah && (
                      <div>
                        <span className="text-gray-500">Kampus:</span>{' '}
                        <span className="font-medium">{selectedOrder.detail_pesanan.kampus_sekolah}</span>
                      </div>
                    )}
                    {selectedOrder.detail_pesanan.jurusan && (
                      <div>
                        <span className="text-gray-500">Jurusan:</span>{' '}
                        <span className="font-medium">{selectedOrder.detail_pesanan.jurusan}</span>
                      </div>
                    )}
                    {selectedOrder.detail_pesanan.tahun_tamat && (
                      <div>
                        <span className="text-gray-500">Tahun:</span>{' '}
                        <span className="font-medium">{selectedOrder.detail_pesanan.tahun_tamat}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Alamat Pengiriman */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Alamat Pengiriman</h3>
                <p className="text-gray-600">{selectedOrder.alamat_pengiriman}</p>
              </div>

              {/* Rincian Biaya */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">Rincian Biaya</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkir</span>
                    <span>{formatCurrency(selectedOrder.ongkir)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">{formatCurrency(selectedOrder.total_harga)}</span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <h3 className="font-semibold mb-3">Ubah Status</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.filter(s => s !== 'Pending').map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedOrder.status === status
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
