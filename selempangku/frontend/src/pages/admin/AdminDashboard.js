import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/helpers';
import { FiShoppingBag, FiUsers, FiCreditCard, FiDollarSign, FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data.data || response.data);
    } catch (error) {
      toast.error('Gagal memuat statistik dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Pesanan',
      value: stats?.total_pesanan || 0,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Member',
      value: stats?.total_member || 0,
      icon: FiUsers,
      color: 'bg-green-500',
      link: '/admin/members'
    },
    {
      title: 'Pembayaran Pending',
      value: stats?.pembayaran_pending || 0,
      icon: FiCreditCard,
      color: 'bg-yellow-500',
      link: '/admin/payments'
    },
    {
      title: 'Total Pendapatan',
      value: formatCurrency(stats?.total_pendapatan || 0),
      icon: FiDollarSign,
      color: 'bg-purple-500',
      link: '/admin/reports'
    }
  ];

  const orderStatusCards = [
    {
      title: 'Pending',
      value: stats?.pesanan_pending || 0,
      icon: FiClock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Proses',
      value: stats?.pesanan_proses || 0,
      icon: FiPackage,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Terkirim',
      value: stats?.pesanan_terkirim || 0,
      icon: FiTruck,
      color: 'text-cyan-600 bg-cyan-100'
    },
    {
      title: 'Selesai',
      value: stats?.pesanan_selesai || 0,
      icon: FiCheckCircle,
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Status Pesanan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {orderStatusCards.map((status, index) => (
            <div
              key={index}
              className={`${status.color} rounded-lg p-4 text-center`}
            >
              <status.icon className="mx-auto mb-2" size={28} />
              <p className="text-2xl font-bold">{status.value}</p>
              <p className="text-sm">{status.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Menu Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/payments"
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <FiCreditCard className="mx-auto mb-2 text-gray-600" size={32} />
            <p className="font-medium">Verifikasi Pembayaran</p>
          </Link>
          <Link
            to="/admin/orders"
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <FiPackage className="mx-auto mb-2 text-gray-600" size={32} />
            <p className="font-medium">Kelola Pesanan</p>
          </Link>
          <Link
            to="/admin/products"
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <FiShoppingBag className="mx-auto mb-2 text-gray-600" size={32} />
            <p className="font-medium">Kelola Produk</p>
          </Link>
          <Link
            to="/admin/reports"
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <FiDollarSign className="mx-auto mb-2 text-gray-600" size={32} />
            <p className="font-medium">Laporan Penjualan</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
