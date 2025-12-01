// ============================================================
// HEADER COMPONENT
// src/components/Header.js
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingBag, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `transition ${
      isActive(path) 
        ? 'text-blue-600 font-semibold' 
        : 'text-gray-700 hover:text-blue-600'
    }`;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900">SelempangKu</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link to="/catalog" className={navLinkClass('/catalog')}>
              Katalog
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/orders" className={navLinkClass('/orders')}>
                  <span className="flex items-center gap-1">
                    <FiShoppingBag size={18} />
                    Pesanan
                  </span>
                </Link>
                
                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <FiUser size={18} />
                    <span>{user?.nama_lengkap || user?.username}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profil Saya
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Riwayat Pesanan
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Daftar
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={navLinkClass('/')}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/catalog"
                className={navLinkClass('/catalog')}
                onClick={() => setMenuOpen(false)}
              >
                Katalog
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={navLinkClass('/dashboard')}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/orders"
                    className={navLinkClass('/orders')}
                    onClick={() => setMenuOpen(false)}
                  >
                    Pesanan Saya
                  </Link>
                  <Link
                    to="/profile"
                    className={navLinkClass('/profile')}
                    onClick={() => setMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <hr />
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 flex items-center gap-2"
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
