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
  if (roles && !roles.includes(user?.role)) {
    // If admin trying to access user routes or vice versa
    if (user?.role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;