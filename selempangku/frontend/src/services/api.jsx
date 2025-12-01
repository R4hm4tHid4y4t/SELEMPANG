// ============================================================
// API SERVICE
// src/services/api.jsx
// Konfigurasi dasar Axios dengan baseURL = http://localhost:4000/api
// ============================================================

import axios from 'axios';

// Base URL untuk API backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
});

// Request Interceptor - tambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - handle response dan error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect berdasarkan path saat ini
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminRoute ? '/admin/login' : '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

// Export instance axios
export default api;

// Export helper functions untuk berbagai HTTP methods
export const apiGet = (url, config = {}) => api.get(url, config);
export const apiPost = (url, data, config = {}) => api.post(url, data, config);
export const apiPut = (url, data, config = {}) => api.put(url, data, config);
export const apiPatch = (url, data, config = {}) => api.patch(url, data, config);
export const apiDelete = (url, config = {}) => api.delete(url, config);

// Helper untuk upload file dengan FormData
export const apiUpload = (url, formData, onUploadProgress) => {
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });
};
