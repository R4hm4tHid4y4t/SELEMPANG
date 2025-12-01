import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { bankService } from '../../services/bankService';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const AdminBanks = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [formData, setFormData] = useState({
    nama_bank: '',
    nomor_rekening: '',
    nama_pemilik: '',
    status: 'Aktif'
  });

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await bankService.getAll();
      setBanks(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Gagal memuat data rekening');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (bank = null) => {
    if (bank) {
      setEditingBank(bank);
      setFormData({
        nama_bank: bank.nama_bank,
        nomor_rekening: bank.nomor_rekening,
        nama_pemilik: bank.nama_pemilik,
        status: bank.status
      });
    } else {
      setEditingBank(null);
      setFormData({
        nama_bank: '',
        nomor_rekening: '',
        nama_pemilik: '',
        status: 'Aktif'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBank(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBank) {
        await bankService.update(editingBank.id, formData);
        toast.success('Rekening berhasil diupdate');
      } else {
        await bankService.create(formData);
        toast.success('Rekening berhasil ditambahkan');
      }
      fetchBanks();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan rekening');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus rekening ini?')) return;

    try {
      await bankService.delete(id);
      toast.success('Rekening berhasil dihapus');
      fetchBanks();
    } catch (error) {
      toast.error('Gagal menghapus rekening');
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
        <h1 className="text-3xl font-bold">Rekening Bank</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus />
          <span>Tambah Rekening</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Bank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                No. Rekening
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nama Pemilik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banks.map((bank) => (
              <tr key={bank.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {bank.nama_bank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono">
                  {bank.nomor_rekening}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bank.nama_pemilik}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bank.status === 'Aktif' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {bank.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => openModal(bank)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(bank.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {banks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Belum ada data rekening
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                {editingBank ? 'Edit Rekening' : 'Tambah Rekening'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Bank
                </label>
                <input
                  type="text"
                  name="nama_bank"
                  value={formData.nama_bank}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Bank BCA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  name="nomor_rekening"
                  value={formData.nomor_rekening}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pemilik
                </label>
                <input
                  type="text"
                  name="nama_pemilik"
                  value={formData.nama_pemilik}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="SelempangKu Store"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
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

export default AdminBanks;
