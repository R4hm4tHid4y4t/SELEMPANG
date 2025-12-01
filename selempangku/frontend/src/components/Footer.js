// ============================================================
// FOOTER COMPONENT
// src/components/Footer.js
// ============================================================

import React from 'react';
// import { Link } from 'react-router-dom';
import { FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">SelempangKu</h3>
            <p className="text-gray-400 mb-4">
              Spesialis selempang wisuda berkualitas tinggi untuk berbagai kebutuhan acara.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Layanan</h3>
            <ul className="text-gray-400 space-y-2">
              <a href="/catalog" >Custom Selempang</a>
              <a href="/catalog" >Bordir</a>
              <a href="/catalog" >Express Order</a>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontak</h3>
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <FiPhone size={18} />
              <span>+62 812-3456-7890</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <FiMail size={18} />
              <span>info@selempangku.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SelempangKu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
