import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/helpers';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nama_produk: '',
    deskripsi: '',
    harga: '',
    gambar_produk: null
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, gambar_produk: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nama_produk: product.nama_produk,
        deskripsi: product.deskripsi || '',
        harga: product.harga,
        gambar_produk: null
      });
      setPreview(product.gambar_produk 
        ? `http://localhost:5000/uploads/produk/${product.gambar_produk}` 
        : null
      );
    } else {
      setEditingProduct(null);
      setFormData({
        nama_produk: '',
        deskripsi: '',
        harga: '',
        gambar_produk: null
      });
      setPreview(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('nama_produk', formData.nama_produk);
    data.append('deskripsi', formData.deskripsi);
    data.append('harga', formData.harga);
    if (formData.gambar_produk) {
      data.append('gambar_produk', formData.gambar_produk);
    }

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, data);
        toast.success('Produk berhasil diupdate');
      } else {
        await productService.create(data);
        toast.success('Produk berhasil ditambahkan');
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan produk');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      await productService.delete(id);
      toast.success('Produk berhasil dihapus');
      fetchProducts();
    } catch (error) {
      toast.error('Gagal menghapus produk');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Produk</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
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
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{product.nama_produk}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {product.deskripsi || 'Tidak ada deskripsi'}
              </p>
              <p className="text-xl font-bold text-blue-600 mb-4">
                {formatCurrency(product.harga)}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(product)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded hover:bg-blue-200"
                >
                  <FiEdit2 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-red-100 text-red-600 px-3 py-2 rounded hover:bg-red-200"
                >
                  <FiTrash2 size={16} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Belum ada produk</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  name="nama_produk"
                  value={formData.nama_produk}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama produk selempang"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga *
                </label>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="75000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi produk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar Produk
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {preview ? (
                    <div className="space-y-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setFormData(prev => ({ ...prev, gambar_produk: null }));
                        }}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Hapus gambar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="product-image"
                      />
                      <label htmlFor="product-image" className="cursor-pointer">
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-gray-600">Klik untuk upload gambar</p>
                        <p className="text-gray-400 text-sm">Max 5MB</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
