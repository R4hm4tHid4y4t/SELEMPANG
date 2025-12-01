// ============================================================
// CONTROLLERS - PROFILE CONTROLLER
// src/controllers/profileController.js
// ============================================================

const UserModel = require('../models/user');
const fs = require('fs');
const path = require('path');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        nomor_telepon: user.nomor_telepon,
        alamat: user.alamat,
        jenis_kelamin: user.jenis_kelamin,
        foto_profil: user.foto_profil,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { nama_lengkap, nomor_telepon, alamat, jenis_kelamin } = req.body;
    
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle file upload
    let foto_profil = user.foto_profil;
    if (req.file) {
      // Delete old file
      if (user.foto_profil) {
        const oldFilePath = path.join(__dirname, '../../uploads/profil', user.foto_profil);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      foto_profil = req.file.filename;
    }

    const updateData = {
      nama_lengkap: nama_lengkap || user.nama_lengkap,
      nomor_telepon: nomor_telepon || user.nomor_telepon,
      alamat: alamat || user.alamat,
      jenis_kelamin: jenis_kelamin || user.jenis_kelamin,
      foto_profil
    };

    await UserModel.update(req.userId, updateData);

    res.status(200).json({
      message: 'Profile updated successfully',
      data: updateData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await UserModel.verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    await UserModel.updatePassword(req.userId, newPassword);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};
