// ============================================================
// UTILITY FUNCTIONS
// src/utils/helpers.js
// ============================================================

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const getStatusBadgeClass = (status) => {
  const statusMap = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Verifikasi': 'bg-blue-100 text-blue-800',
    'Proses': 'bg-purple-100 text-purple-800',
    'Terkirim': 'bg-cyan-100 text-cyan-800',
    'Selesai': 'bg-green-100 text-green-800',
    'Ditolak': 'bg-red-100 text-red-800',
    'Dibatalkan': 'bg-gray-100 text-gray-800'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status) => {
  const statusMap = {
    'Pending': 'Menunggu',
    'Verifikasi': 'Verifikasi',
    'Proses': 'Proses Produksi',
    'Terkirim': 'Dalam Pengiriman',
    'Selesai': 'Selesai',
    'Ditolak': 'Ditolak',
    'Dibatalkan': 'Dibatalkan'
  };
  return statusMap[status] || status;
};
