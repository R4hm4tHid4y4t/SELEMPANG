// ============================================================
// APP ROUTES
// src/router/AppRoutes.jsx
// ============================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Components
import ProtectedRoute from '../components/ProtectedRoute';

// User Pages
import Home from '../pages/user/Home';
import Register from '../pages/user/Register';
import VerifyEmail from '../pages/user/VerifyEmail';
import Login from '../pages/user/Login';
import ForgotPassword from '../pages/user/ForgotPassword';
import ResetPassword from '../pages/user/ResetPassword';
import Catalog from '../pages/user/Catalog';
import CatalogGuest from '../pages/user/CatalogGuest';
import CatalogUser from '../pages/user/CatalogUser';
import ProductDetail from '../pages/user/ProductDetail';
import ProductDetailGuest from '../pages/user/ProductDetailGuest';
import ProductDetailUser from '../pages/user/ProductDetailUser';
import Checkout from '../pages/user/Checkout';
import OrderForm from '../pages/user/OrderForm';
import Payment from '../pages/user/Payment';
import PaymentUpload from '../pages/user/PaymentUpload';
import Profile from '../pages/user/Profile';
import OrderHistory from '../pages/user/OrderHistory';
import DashboardUser from '../pages/user/DashboardUser';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminBanks from '../pages/admin/AdminBanks';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminMembers from '../pages/admin/AdminMembers';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminReports from '../pages/admin/AdminReports';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ============================================ */}
      {/* PUBLIC USER ROUTES (Tanpa Login)            */}
      {/* ============================================ */}
      <Route element={<MainLayout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />
        
        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
        
        {/* Catalog (General - bisa guest atau user) */}
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog-guest" element={<CatalogGuest />} />
        
        {/* Product Detail (General) */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product-guest/:id" element={<ProductDetailGuest />} />

        {/* ============================================ */}
        {/* PROTECTED USER ROUTES (Butuh Login)         */}
        {/* ============================================ */}
        
        {/* Dashboard User */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardUser />
            </ProtectedRoute>
          } 
        />

        {/* Catalog User (sudah login) */}
        <Route 
          path="/catalog-user" 
          element={
            <ProtectedRoute>
              <CatalogUser />
            </ProtectedRoute>
          } 
        />

        {/* Product Detail User (sudah login) */}
        <Route 
          path="/product-user/:id" 
          element={
            <ProtectedRoute>
              <ProductDetailUser />
            </ProtectedRoute>
          } 
        />

        {/* Order Form */}
        <Route 
          path="/order" 
          element={
            <ProtectedRoute>
              <OrderForm />
            </ProtectedRoute>
          } 
        />

        {/* Checkout */}
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />

        {/* Payment */}
        <Route 
          path="/payment/:orderId" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } 
        />

        {/* Payment Upload */}
        <Route 
          path="/payment-upload/:orderId" 
          element={
            <ProtectedRoute>
              <PaymentUpload />
            </ProtectedRoute>
          } 
        />

        {/* Profile */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Order History */}
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* ============================================ */}
      {/* ADMIN ROUTES                                 */}
      {/* ============================================ */}
      
      {/* Admin Login (Public) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route 
        element={
          <ProtectedRoute roles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Admin Bank Accounts */}
        <Route path="/admin/banks" element={<AdminBanks />} />
        
        {/* Admin Products */}
        <Route path="/admin/products" element={<AdminProducts />} />
        
        {/* Admin Members */}
        <Route path="/admin/members" element={<AdminMembers />} />
        
        {/* Admin Payments/Proofs */}
        <Route path="/admin/payments" element={<AdminPayments />} />
        
        {/* Admin Orders */}
        <Route path="/admin/orders" element={<AdminOrders />} />
        
        {/* Admin Sales Report */}
        <Route path="/admin/reports" element={<AdminReports />} />
      </Route>

      {/* ============================================ */}
      {/* FALLBACK ROUTES                              */}
      {/* ============================================ */}
      
      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
