// ============================================================
// ADMIN SIDEBAR COMPONENT
// src/components/AdminSidebar.js
// ============================================================

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiCreditCard, 
  FiPackage, 
  FiUsers, 
  FiDollarSign,
  FiShoppingCart,
  FiBarChart2,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';

const AdminSidebar = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: FiHome 
    },
    { 
      label: 'Rekening Bank', 
      path: '/admin/banks', 
      icon: FiCreditCard 
    },
    { 
      label: 'Produk', 
      path: '/admin/products', 
      icon: FiPackage 
    },
    { 
      label: 'Member', 
      path: '/admin/members', 
      icon: FiUsers 
    },
    { 
      label: 'Pembayaran', 
      path: '/admin/payments', 
      icon: FiDollarSign 
    },
    { 
      label: 'Pesanan', 
      path: '/admin/orders', 
      icon: FiShoppingCart 
    },
    { 
      label: 'Laporan', 
      path: '/admin/reports', 
      icon: FiBarChart2 
    }
  ];

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-gray-400">SelempangKu</p>
              </div>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block p-2 hover:bg-gray-700 rounded-lg transition"
          >
            {collapsed ? <FiMenu className="text-white" /> : <FiX className="text-white" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded-lg transition ${
                active 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <FiUsers className="text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                {user?.nama_lengkap || 'Admin'}
              </p>
              <p className="text-gray-400 text-xs">{user?.email}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 transition ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <FiLogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:block bg-gray-800 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-gray-800 z-50 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="font-bold text-gray-900">Admin Panel</h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <FiSettings size={20} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminSidebar;
