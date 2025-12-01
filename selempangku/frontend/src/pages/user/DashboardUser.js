// ============================================================
// DASHBOARD USER
// src/pages/user/DashboardUser.js
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';

const DashboardUser = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await orderService.getMyOrders();
      const orderData = response.data.data || response.data || [];
      setOrders(orderData.slice(0, 5));
      
      // Calculate stats
      setStats({
        total: orderData.length,
        pending: orderData.filter(o => o.status === 'Menunggu Pembayaran').length,
        processing: orderData.filter(o => o.status === 'Diproses').length,
        completed: orderData.filter(o => o.status === 'Selesai').length
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Menunggu Pembayaran': 'bg-yellow-100 text-yellow-800',
      'Menunggu Konfirmasi': 'bg-blue-100 text-blue-800',
      'Diproses': 'bg-purple-100 text-purple-800',
      'Dikirim': 'bg-indigo-100 text-indigo-800',
      'Selesai': 'bg-green-100 text-green-800',
      'Dibatalkan': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Selamat Datang, {user?.nama_lengkap || user?.username}!
          </h1>
          <p className="text-blue-100">
            Kelola pesanan dan lihat status terbaru di dashboard Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-gray-500 text-sm">Total Pesanan</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-500 text-sm">Menunggu Bayar</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="text-3xl font-bold text-purple-600">{stats.processing}</div>
            <div className="text-gray-500 text-sm">Diproses</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-gray-500 text-sm">Selesai</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/catalog"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🛍️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Lihat Katalog</h3>
              <p className="text-gray-500 text-sm">Jelajahi produk selempang</p>
            </div>
          </Link>

          <Link
            to="/orders"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Riwayat Pesanan</h3>
              <p className="text-gray-500 text-sm">Lihat semua pesanan Anda</p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Profil Saya</h3>
              <p className="text-gray-500 text-sm">Kelola informasi akun</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h2>
            <Link to="/orders" className="text-blue-600 hover:underline text-sm">
              Lihat Semua
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order.id} className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">
                      Order #{order.id}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(order.tanggal_pesan).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(order.total_bayar)}
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-500 mb-4">Belum ada pesanan</p>
              <Link
                to="/catalog"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Mulai Belanja
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
