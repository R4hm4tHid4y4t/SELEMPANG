import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const VerifyEmail = () => {
  const [kode, setKode] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Email biasanya dikirim dari halaman Register lewat navigate(..., { state: { email } })
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Data email tidak ditemukan. Silakan daftar ulang.');
      navigate('/register');
      return;
    }

    if (!kode.trim()) {
      toast.error('Kode verifikasi harus diisi.');
      return;
    }

    try {
      setLoading(true);

      // Panggil API verifikasi OTP
      const res = await authService.verifyEmail({
        email,
        otp: kode.trim(),
      });

      // Jika backend mengembalikan user + token, langsung login & redirect
      if (res.data && res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        toast.success('Verifikasi berhasil. Selamat datang!');
        navigate('/');          // atau '/dashboard-user' jika punya route khusus
      } else {
        // Kalau backend hanya balas sukses tanpa token, cukup arahkan ke halaman login
        toast.success('Verifikasi berhasil. Silakan login.');
        navigate('/login');
      }
    } catch (err) {
      // Jika OTP salah atau error lain, tetap di halaman ini
      const msg =
        err.response?.data?.message ||
        'Kode verifikasi salah atau sudah kadaluarsa.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Data email tidak ditemukan. Silakan daftar ulang.');
      navigate('/register');
      return;
    }

    try {
      setLoading(true);
      // Di sini bisa pakai endpoint khusus kirim ulang OTP kalau sudah dibuat
      await authService.registerResendOtp?.({ email });
      toast.success('Kode verifikasi baru telah dikirim ke email Anda.');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Gagal mengirim ulang kode verifikasi.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-md border border-gray-200 px-6 sm:px-10 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">
          Verifikasi Email
        </h1>

        <p className="text-center text-gray-700 mb-10 text-base sm:text-lg">
          Kami mengirimkan kode verifikasi ke Email Anda
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="kode"
            className="block text-center text-xl sm:text-2xl font-semibold text-gray-900 mb-4"
          >
            Kode Verifikasi
          </label>

          <div className="mb-8 flex justify-center">
            <input
              id="kode"
              type="text"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="Masukkan kode verifikasi"
              className="w-full max-w-md px-4 py-3 sm:py-4 border border-gray-300 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg sm:text-xl py-3 sm:py-4 rounded-xl transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Memverifikasi...' : 'Verifikasi'}
            </button>
          </div>
        </form>

        <div className="text-center text-gray-700 text-sm sm:text-base">
          <span>Tidak menerima kode? </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-blue-600 font-semibold hover:underline disabled:text-gray-400"
          >
            Kirim Ulang Kode
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
