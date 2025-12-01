import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/helpers';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getById(id);
      setProduct(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat detail produk');
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    if (!isAuthenticated) {
      toast.info('Silakan login terlebih dahulu untuk memesan');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    navigate('/checkout', { state: { product } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
        <Link to="/catalog" className="text-blue-600 hover:underline">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/catalog" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Kembali ke Katalog
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                {product.gambar_produk ? (
                  <img
                    src={`http://localhost:5000/uploads/produk/${product.gambar_produk}`}
                    alt={product.nama_produk}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-8xl">👗</span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold mb-4">{product.nama_produk}</h1>
              
              <div className="text-4xl font-bold text-blue-600 mb-6">
                {formatCurrency(product.harga)}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.deskripsi || 'Selempang berkualitas tinggi dengan bahan premium dan desain elegan.'}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Keunggulan</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Bahan premium berkualitas tinggi
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Bordir rapi dan tahan lama
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom sesuai permintaan
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Pengerjaan cepat
                  </li>
                </ul>
              </div>

              <button
                onClick={handleOrder}
                className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                {isAuthenticated ? 'Pesan Sekarang' : 'Login untuk Memesan'}
              </button>

              {!isAuthenticated && (
                <p className="text-center text-gray-500 mt-4 text-sm">
                  Belum punya akun?{' '}
                  <Link to="/register" className="text-blue-600 hover:underline">
                    Daftar sekarang
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
