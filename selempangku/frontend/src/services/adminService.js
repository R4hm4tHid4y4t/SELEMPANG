// src/services/adminService.js
import api from './api';

export const adminService = {
  // Auth Admin
  login: (data) => api.post('/auth/admin/login', data),

  // Dashboard & Stats
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Members
  getMembers: () => api.get('/admin/members'),
  updateMemberStatus: (id, status) => api.put(`/admin/members/${id}/status`, { status }),
  
  // Reports
  getReports: () => api.get('/admin/reports'),
  getDailyReport: (params) => api.get('/admin/reports/daily', { params }),
  getMonthlyReport: (params) => api.get('/admin/reports/monthly', { params }),
};
