import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { FiCalendar, FiTrendingUp, FiDollarSign, FiShoppingBag } from 'react-icons/fi';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, reportsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getReports()
      ]);

      setStats(statsRes.data.data || statsRes.data);
      
      const reports = reportsRes.data.data || reportsRes.data || [];
      
      // Process data for daily and monthly views
      setDailyData(reports);
      
      // Group by month for monthly view
      const monthlyGrouped = reports.reduce((acc, item) => {
        const date = new Date(item.tanggal);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            bulan: monthKey,
            total_penjualan: 0,
            total_pendapatan: 0,
            jumlah_pesanan: 0
          };
        }
        
        acc[monthKey].total_penjualan += parseInt(item.total_penjualan || 0);
        acc[monthKey].total_pendapatan += parseFloat(item.total_pendapatan || 0);
        acc[monthKey].jumlah_pesanan += parseInt(item.jumlah_pesanan || 0);
        
        return acc;
      }, {});
      
      setMonthlyData(Object.values(monthlyGrouped).sort((a, b) => b.bulan.localeCompare(a.bulan)));
      
    } catch (error) {
      toast.error('Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  const filteredDaily = dailyData.filter(item => {
    if (!dateFilter.startDate && !dateFilter.endDate) return true;
    
    const itemDate = new Date(item.tanggal);
    const start = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
    const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
    
    if (start && itemDate < start) return false;
    if (end && itemDate > end) return false;
    
    return true;
  });

  const calculateTotals = (data) => {
    return data.reduce((acc, item) => ({
      total_penjualan: acc.total_penjualan + parseInt(item.total_penjualan || 0),
      total_pendapatan: acc.total_pendapatan + parseFloat(item.total_pendapatan || 0),
      jumlah_pesanan: acc.jumlah_pesanan + parseInt(item.jumlah_pesanan || 0)
    }), { total_penjualan: 0, total_pendapatan: 0, jumlah_pesanan: 0 });
  };

  const getMonthName = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  // Simple bar chart component
  const SimpleBarChart = ({ data, maxValue, label }) => {
    const percentage = maxValue > 0 ? (data / maxValue) * 100 : 0;
    return (
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <span className="text-sm font-medium w-20 text-right">{label}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totals = calculateTotals(activeTab === 'daily' ? filteredDaily : monthlyData);
  const maxPendapatan = Math.max(...(activeTab === 'daily' ? filteredDaily : monthlyData).map(d => parseFloat(d.total_pendapatan) || 0), 1);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Laporan Penjualan</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Pendapatan</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.total_pendapatan || 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiDollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Pesanan Selesai</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.pesanan_selesai || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiShoppingBag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Produk</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats?.total_produk || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiTrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'daily'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'monthly'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bulanan
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Date Filter for Daily */}
          {activeTab === 'daily' && (
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <FiCalendar className="text-gray-400" />
                <input
                  type="date"
                  name="startDate"
                  value={dateFilter.startDate}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-gray-500 self-center">sampai</span>
              <div className="flex items-center space-x-2">
                <FiCalendar className="text-gray-400" />
                <input
                  type="date"
                  name="endDate"
                  value={dateFilter.endDate}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {(dateFilter.startDate || dateFilter.endDate) && (
                <button
                  onClick={() => setDateFilter({ startDate: '', endDate: '' })}
                  className="text-blue-600 hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}

          {/* Chart Visualization */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">
              Grafik Pendapatan {activeTab === 'daily' ? 'Harian' : 'Bulanan'}
            </h3>
            <div className="space-y-3">
              {(activeTab === 'daily' ? filteredDaily.slice(0, 10) : monthlyData.slice(0, 12)).map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-32 text-sm text-gray-600">
                    {activeTab === 'daily' 
                      ? formatDate(item.tanggal) 
                      : getMonthName(item.bulan)}
                  </span>
                  <div className="flex-1">
                    <SimpleBarChart 
                      data={parseFloat(item.total_pendapatan) || 0}
                      maxValue={maxPendapatan}
                      label={formatCurrency(item.total_pendapatan || 0)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Totals */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">
              Ringkasan {activeTab === 'daily' ? 'Periode' : 'Total'}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-500 text-sm">Total Item Terjual</p>
                <p className="text-xl font-bold">{totals.total_penjualan}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Jumlah Pesanan</p>
                <p className="text-xl font-bold">{totals.jumlah_pesanan}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Pendapatan</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(totals.total_pendapatan)}
                </p>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {activeTab === 'daily' ? 'Tanggal' : 'Bulan'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Penjualan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Jumlah Pesanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Pendapatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rata-rata/Pesanan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(activeTab === 'daily' ? filteredDaily : monthlyData).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activeTab === 'daily' 
                        ? formatDate(item.tanggal) 
                        : getMonthName(item.bulan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.total_penjualan} item
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.jumlah_pesanan} pesanan
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                      {formatCurrency(item.total_pendapatan || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(item.rata_rata_nilai_pesanan || 
                        (item.jumlah_pesanan > 0 ? item.total_pendapatan / item.jumlah_pesanan : 0)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(activeTab === 'daily' ? filteredDaily : monthlyData).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Tidak ada data laporan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
