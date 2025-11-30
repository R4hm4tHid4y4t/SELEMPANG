// ============================================================
// UTILITIES - EMAIL HELPER
// src/utils/email.js
// ============================================================

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Kode Verifikasi Email - SelempangKu',
      html: `
        <h2>Verifikasi Email Anda</h2>
        <p>Masukkan kode verifikasi berikut untuk menyelesaikan registrasi:</p>
        <h1>${otp}</h1>
        <p>Kode ini berlaku selama 10 menit.</p>
        <p>Jika Anda tidak melakukan permintaan ini, abaikan email ini.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Password - SelempangKu',
      html: `
        <h2>Reset Password Anda</h2>
        <p>Klik link di bawah untuk mereset password Anda:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link ini berlaku selama 1 jam.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail
};