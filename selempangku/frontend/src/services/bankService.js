// ============================================================
// BANK SERVICE
// src/services/bankService.js
// ============================================================

import api from './api';

export const bankService = {
  getAll: () => api.get('/banks'),
  create: (data) => api.post('/banks', data),
  update: (id, data) => api.put(`/banks/${id}`, data),
  delete: (id) => api.delete(`/banks/${id}`)
};
