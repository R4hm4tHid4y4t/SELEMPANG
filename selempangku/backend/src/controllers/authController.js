// ============================================================
// CONTROLLERS - AUTH CONTROLLER
// src/controllers/authController.js
// ============================================================

const UserModel = require('../models/user');
const { generateToken } = require('../utils/jwt');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/email');
const { validateEmail, validatePassword, generateOTP } = require('../utils/validation');

// Store OTP temporarily (in production, use Redis)
const otpStore = {};
const resetTokenStore = {};

// Register
exports.register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword, nama_lengkap, nomor_telepon } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Email, username, and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Generate OTP
    const otp = generateOTP();
    otpStore[email] = { otp, userData: { email, username, password, nama_lengkap, nomor_telepon }, expiresAt: Date.now() + 10 * 60000 };

    // Send OTP to email
    await sendOTPEmail(email, otp);

    res.status(200).json({ 
      message: 'OTP sent to your email',
      email: email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Check OTP
    const otpData = otpStore[email];
    if (!otpData || otpData.otp !== otp || otpData.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Create user
    const userData = otpData.userData;
    const userId = await UserModel.create(userData);

    // Cleanup OTP
    delete otpStore[email];

    res.status(201).json({ 
      message: 'Email verified successfully',
      userId: userId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Email verification failed' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await UserModel.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = generateOTP();
    resetTokenStore[email] = { token: resetToken, expiresAt: Date.now() + 60 * 60000 };

    // Send reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${email}/${resetToken}`;
    await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Forgot password process failed' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword, confirmPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'Email, token, and new password are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Verify reset token
    const resetData = resetTokenStore[email];
    if (!resetData || resetData.token !== token || resetData.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    await UserModel.updatePassword(user.id, newPassword);

    // Cleanup reset token
    delete resetTokenStore[email];

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Password reset failed' });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        nomor_telepon: user.nomor_telepon,
        alamat: user.alamat,
        jenis_kelamin: user.jenis_kelamin,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get user' });
  }
};
