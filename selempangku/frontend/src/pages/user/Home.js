// src/pages/user/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/helpers';

// gambar hero & ikon
import heroSelempang from '../../assets/images/84c869f7ff8df289c5653a0d4f239a69b2c0f356.png';
import ikonMedaliHijau from '../../assets/images/app-hijau.png';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      const allProducts = response.data.data || response.data || [];
      setProducts(allProducts.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      {/* Hero section */}
      <section className="flex-1">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10 lg:py-14">
          <div
            className="
              rounded-3xl
              px-6 py-8 md:px-10 md:py-10
              flex flex-col md:flex-row gap-10 items-center
              shadow-[0_18px_45px_rgba(15,35,95,0.12)]
              bg-gradient-to-r from-[#eef3ff] via-[#eef3ff] to-[#dde9ff]
            "
          >
            {/* Kiri: teks */}
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 shadow-sm">
                ★ Kualitas Premium
              </div>

              <h1 className="text-[28px] md:text-[32px] font-extrabold text-gray-900 mb-4 leading-snug">
                Selempang Custom
                <br />
                <span className="text-[#2563eb]">Berkualitas Tinggi</span>
              </h1>

              <p className="text-gray-600 mb-5 max-w-xl text-sm md:text-base">
                Pesan selempang custom untuk berbagai acara dan kebutuhan.
                Desain sesuai keinginan dengan bahan berkualitas dan hasil
                memuaskan.
              </p>

              <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-lg mt-0.5">✓</span>
                  <span>Desain custom sesuai kebutuhan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-lg mt-0.5">✓</span>
                  <span>Bahan berkualitas premium</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-lg mt-0.5">✓</span>
                  <span>Pengerjaan cepat dan rapi</span>
                </li>
              </ul>
            </div>

            {/* Kanan: gambar mockup */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                {/* Frame putih */}
                <div className="w-80 h-48 md:w-[380px] md:h-[220px] bg-white rounded-[22px] shadow-[0_20px_40px_rgba(25,35,80,0.25)] overflow-hidden flex items-center justify-center">
                  <img
                    src={heroSelempang}
                    alt="Selempang custom berkualitas tinggi"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Lencana hijau */}
                <div className="absolute -bottom-6 left-10 w-14 h-14 rounded-full shadow-[0_10px_20px_rgba(16,185,129,0.6)]">
                  <img
                    src={ikonMedaliHijau}
                    alt="Ikon kualitas"
                    className="w-14 h-14 rounded-full"
                  />
                </div>

                {/* Lencana mahkota kuning */}
                <div className="absolute -top-5 -right-5 w-12 h-12 rounded-full bg-[#facc15] flex items-center justify-center text-white text-xl shadow-[0_10px_20px_rgba(234,179,8,0.6)]">
                  👑
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Box "Buat Pesanan Baru" */}
        <div className="max-w-6xl mx-auto px-4 lg:px-0 pb-10">
          <div className="bg-white rounded-3xl border border-[#1d4ed8]/40 py-10 px-4 md:px-10 text-center shadow-[0_18px_40px_rgba(15,35,95,0.08)]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shadow-sm">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-[#2563eb] mb-1">
                  Buat Pesanan Baru
                </h2>
                <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto">
                  Mulai pesan selempang custom sesuai kebutuhan Anda dengan mudah dan cepat
                </p>
              </div>
              <Link
                to={isAuthenticated ? '/catalog' : '/login'}
                className="mt-2 inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm md:text-base font-semibold shadow-[0_10px_20px_rgba(37,99,235,0.45)]"
              >
                + Pesan Selempang Sekarang
              </Link>
            </div>
          </div>
        </div>

        {/* Produk Highlight Section */}
        <div className="max-w-6xl mx-auto px-4 lg:px-0 pb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Produk Terbaru</h2>
            <Link
              to="/catalog"
              className="text-blue-600 hover:underline font-semibold"
            >
              Lihat Semua &rarr;
            </Link>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {product.gambar_produk ? (
                      <img
                        src={`http://localhost:5000/uploads/produk/${product.gambar_produk}`}
                        alt={product.nama_produk}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">👗</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {product.nama_produk}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.deskripsi || 'Selempang custom berkualitas tinggi'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(product.harga)}
                      </span>
                      <Link
                        to={`/product/${product.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow">
              <p className="text-gray-500">Belum ada produk tersedia</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
