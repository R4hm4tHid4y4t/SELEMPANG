import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { paymentService } from '../../services/paymentService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { FiCheck, FiX, FiEye, FiFilter } from 'react-icons/fi';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentService.getAll();
      setPayments(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Gagal memuat data pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await paymentService.verify(id, { status_pembayaran: status });
      toast.success(`Pembayaran ${status === 'Terverifikasi' ? 'diverifikasi' : 'ditolak'}`);
      fetchPayments();
      setShowModal(false);
    } catch (error) {
      toast.error('Gagal memproses verifikasi');
    }
  };

  const openDetail = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const filteredPayments = payments.filter(p => {
    if (filter === 'all') return true;
    return p.status_pembayaran === filter;
  });

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Terverifikasi': 'bg-green-100 text-green-800',
      'Ditolak': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold">Bukti Pembayaran</h1>
        <div className="flex items-center space-x-2">
          <FiFilter className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Terverifikasi">Terverifikasi</option>
            <option value="Ditolak">Ditolak</option>
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
                  Bank Pengirim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Jumlah
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {payment.pesanan?.nomor_pesanan || payment.nomor_pesanan || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.pesanan?.user?.nama_lengkap || payment.customer_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.bank_pengirim}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {formatCurrency(payment.jumlah_transfer)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.tanggal_pembayaran || payment.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(payment.status_pembayaran)}`}>
                      {payment.status_pembayaran}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => openDetail(payment)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Lihat Detail"
                    >
                      <FiEye size={18} />
                    </button>
                    {payment.status_pembayaran === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleVerify(payment.id, 'Terverifikasi')}
                          className="text-green-600 hover:text-green-800 mr-2"
                          title="Verifikasi"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={() => handleVerify(payment.id, 'Ditolak')}
                          className="text-red-600 hover:text-red-800"
                          title="Tolak"
                        >
                          <FiX size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada data pembayaran
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">Detail Pembayaran</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-4">
              {/* Payment Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">No. Pesanan</p>
                  <p className="font-semibold">
                    {selectedPayment.pesanan?.nomor_pesanan || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(selectedPayment.status_pembayaran)}`}>
                    {selectedPayment.status_pembayaran}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bank Pengirim</p>
                  <p className="font-semibold">{selectedPayment.bank_pengirim}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">No. Rekening Pengirim</p>
                  <p className="font-semibold">{selectedPayment.nomor_rekening || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jumlah Transfer</p>
                  <p className="font-semibold text-lg text-blue-600">
                    {formatCurrency(selectedPayment.jumlah_transfer)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Pembayaran</p>
                  <p className="font-semibold">
                    {formatDate(selectedPayment.tanggal_pembayaran || selectedPayment.created_at)}
                  </p>
                </div>
              </div>

              {/* Bukti Pembayaran */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Bukti Pembayaran</p>
                {selectedPayment.bukti_pembayaran ? (
                  <img
                    src={`http://localhost:5000/uploads/bukti_pembayaran/${selectedPayment.bukti_pembayaran}`}
                    alt="Bukti Pembayaran"
                    className="max-w-full rounded-lg border"
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                    Tidak ada bukti pembayaran
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedPayment.status_pembayaran === 'Pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleVerify(selectedPayment.id, 'Terverifikasi')}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700"
                  >
                    <FiCheck />
                    <span>Verifikasi Pembayaran</span>
                  </button>
                  <button
                    onClick={() => handleVerify(selectedPayment.id, 'Ditolak')}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700"
                  >
                    <FiX />
                    <span>Tolak Pembayaran</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
