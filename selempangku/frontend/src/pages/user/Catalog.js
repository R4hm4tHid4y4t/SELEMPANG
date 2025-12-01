import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/helpers';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Katalog Selempang</h1>
        <p className="text-gray-600 mb-8">Pilih produk selempang yang Anda inginkan</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
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
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{product.nama_produk}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.deskripsi}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(product.harga)}
                  </span>
                  <Link
                    to={`/product/${product.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Tidak ada produk tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
