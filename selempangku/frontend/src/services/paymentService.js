// ============================================================
// PAYMENT SERVICE
// src/services/paymentService.js
// ============================================================

import api from './api';

export const paymentService = {
  create: (formData) => api.post('/payments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getByUser: () => api.get('/payments'),
  getAll: () => api.get('/payments/admin/all'),
  verify: (id, data) => api.put(`/payments/${id}/verify`, data)
};