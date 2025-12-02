// ============================================================
// PROTECTED ROUTE COMPONENT
// src/components/ProtectedRoute.js
// ============================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if trying to access admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!isAuthenticated) {
    // Redirect to admin login for admin routes, otherwise user login
    return <Navigate to={isAdminRoute ? '/admin/login' : '/login'} state={{ from: location }} replace />;
  }

  // Check role authorization
const normalizedUserRole = user?.role?.toString().toLowerCase();

if (roles) {
  const normalizedRoles = roles.map(r => r.toString().toLowerCase());
  if (!normalizedRoles.includes(normalizedUserRole)) {
    if (normalizedUserRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
}

  return children;
};

export default ProtectedRoute;