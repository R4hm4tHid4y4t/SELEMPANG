// ============================================================
// PRIVATE ROUTE COMPONENT
// src/components/PrivateRoute.js
// ============================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Check if trying to access admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Not authenticated - redirect to appropriate login
  if (!isAuthenticated) {
    const loginPath = isAdminRoute ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check role authorization if roles are specified
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Admin trying to access user routes
    if (user?.role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // User trying to access admin routes
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
