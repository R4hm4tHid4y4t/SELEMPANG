import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import Home from './pages/user/Home';
import Register from './pages/user/Register';
import VerifyEmail from './pages/user/VerifyEmail';
import Login from './pages/user/Login';
import ForgotPassword from './pages/user/ForgotPassword';
import ResetPassword from './pages/user/ResetPassword';
import Catalog from './pages/user/Catalog';
import ProductDetail from './pages/user/ProductDetail';
import Checkout from './pages/user/Checkout';
import Payment from './pages/user/Payment';
import Profile from './pages/user/Profile';
import OrderHistory from './pages/user/OrderHistory';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBanks from './pages/admin/AdminBanks';
import AdminProducts from './pages/admin/AdminProducts';
import AdminMembers from './pages/admin/AdminMembers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReports from './pages/admin/AdminReports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          {/* User Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Protected User Routes */}
            <Route 
              path="/checkout" 
              element={<ProtectedRoute><Checkout /></ProtectedRoute>} 
            />
            <Route 
              path="/payment/:orderId" 
              element={<ProtectedRoute><Payment /></ProtectedRoute>} 
            />
            <Route 
              path="/profile" 
              element={<ProtectedRoute><Profile /></ProtectedRoute>} 
            />
            <Route 
              path="/orders" 
              element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} 
            />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route element={<ProtectedRoute roles={['Admin']}><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/banks" element={<AdminBanks />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
