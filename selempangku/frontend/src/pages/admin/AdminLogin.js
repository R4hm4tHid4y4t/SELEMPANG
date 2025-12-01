// src/pages/admin/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';
import logoMedalBiru from '../../assets/images/app-biru.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@selempangku.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // pastikan AuthContext-mu support role Admin

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Email dan password wajib diisi');
      return;
    }

    try {
      setLoading(true);

      // LOGIN ADMIN ke endpoint /auth/admin/login
      const res = await adminService.login({ email, password });

      if (res.data?.user && res.data?.token) {
        // simpan user + token ke context / localStorage
        login(res.data.user, res.data.token);
        toast.success('Berhasil login sebagai admin');
        navigate('/admin/dashboard'); // arahkan ke halaman dashboard admin
      } else {
        toast.error('Login gagal. Data tidak valid.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Email atau password salah.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e7ef] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.18)] px-8 py-10">
        {/* Logo + judul */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <img src={logoMedalBiru} alt="SelempangKu" className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold text-gray-800 mb-1">
            SelempangKu
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Login Admin</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <span>✉</span>
              </div>
              <input
                id="email"
                type="email"
                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-dashed border-gray-300 bg-[#f5f7fb] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@selempangku.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <span>🔒</span>
              </div>
              <input
                id="password"
                type="password"
                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-dashed border-gray-300 bg-[#f5f7fb] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm py-3 rounded-xl shadow-[0_12px_30px_rgba(37,99,235,0.45)] disabled:bg-gray-400 disabled:shadow-none transition-colors"
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
