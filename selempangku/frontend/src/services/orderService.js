// ============================================================
// ORDER SERVICE
// src/services/orderService.js
// ============================================================

import api from './api';

export const orderService = {
  create: (data) => api.post('/orders', data),
  getByUser: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: () => api.get('/orders/admin/all'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};