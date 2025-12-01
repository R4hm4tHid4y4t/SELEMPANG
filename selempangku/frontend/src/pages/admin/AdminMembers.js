import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';
import { FiUser, FiMail, FiPhone, FiSearch } from 'react-icons/fi';

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await adminService.getMembers();
      setMembers(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Gagal memuat data member');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => 
    member.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    member.email?.toLowerCase().includes(search.toLowerCase()) ||
    member.username?.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold">Daftar Member</h1>
        <div className="text-gray-600">
          Total: <span className="font-bold">{members.length}</span> member
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari member..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                {member.foto_profil ? (
                  <img
                    src={`http://localhost:5000/uploads/profil/${member.foto_profil}`}
                    alt={member.nama_lengkap}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="text-blue-600" size={24} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {member.nama_lengkap || member.username}
                </h3>
                <p className="text-gray-500 text-sm">@{member.username}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <FiMail className="mr-2 flex-shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
              {member.nomor_telepon && (
                <div className="flex items-center text-gray-600">
                  <FiPhone className="mr-2 flex-shrink-0" />
                  <span>{member.nomor_telepon}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
              <span className="text-gray-500">
                Bergabung: {formatDate(member.created_at)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                member.status === 'Aktif' || !member.status
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {member.status || 'Aktif'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiUser className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">
            {search ? 'Tidak ada member yang cocok' : 'Belum ada member'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
