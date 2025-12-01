# API Documentation - SelempangKu

## Base URL
```
http://localhost:5000/api
```

## Authentication
Semua endpoint yang memerlukan autentikasi harus menyertakan header:
```
Authorization: Bearer <token>
```

---

## 1. AUTH ENDPOINTS

### Register
```
POST /auth/register
```
Body:
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "confirmPassword": "password123",
  "nama_lengkap": "Nama Lengkap",
  "nomor_telepon": "081234567890"
}
```

### Verify Email (OTP)
```
POST /auth/verify-email
```
Body:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### Login User
```
POST /auth/login
```
Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login Admin
```
POST /auth/admin/login
```
Body:
```json
{
  "email": "admin@selempangku.com",
  "password": "admin123"
}
```

### Forgot Password
```
POST /auth/forgot-password
```
Body:
```json
{
  "email": "user@example.com"
}
```

### Reset Password
```
POST /auth/reset-password
```
Body:
```json
{
  "email": "user@example.com",
  "token": "reset_token",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer <token>
```

---

## 2. PRODUCT ENDPOINTS

### Get All Products
```
GET /products
```

### Get Product by ID
```
GET /products/:id
```

### Create Product (Admin)
```
POST /products
Headers: Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Body:
- nama_produk: string
- deskripsi: string
- harga: number
- gambar_produk: file (optional)
```

### Update Product (Admin)
```
PUT /products/:id
Headers: Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Body:
- nama_produk: string
- deskripsi: string
- harga: number
- gambar_produk: file (optional)
```

### Delete Product (Admin)
```
DELETE /products/:id
Headers: Authorization: Bearer <admin_token>
```

---

## 3. ORDER ENDPOINTS

### Create Order
```
POST /orders
Headers: Authorization: Bearer <token>
```
Body:
```json
{
  "produk_id": 1,
  "jumlah": 2,
  "alamat_pengiriman": "Jl. Contoh No. 123",
  "ongkir": 15000
}
```

### Get User Orders
```
GET /orders
Headers: Authorization: Bearer <token>
```

### Get Order by ID
```
GET /orders/:id
Headers: Authorization: Bearer <token>
```

### Get All Orders (Admin)
```
GET /orders/admin/all
Headers: Authorization: Bearer <admin_token>
```

### Update Order Status (Admin)
```
PUT /orders/:id/status
Headers: Authorization: Bearer <admin_token>
```
Body:
```json
{
  "status": "Proses"
}
```
Status options: Pending, Verifikasi, Proses, Terkirim, Selesai, Dibatalkan

---

## 4. PAYMENT ENDPOINTS

### Submit Payment
```
POST /payments
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- pesanan_id: number
- metode_pembayaran: string
- bank_pengirim: string
- nomor_rekening: string
- jumlah_transfer: number
- bukti_pembayaran: file
```

### Get User Payments
```
GET /payments
Headers: Authorization: Bearer <token>
```

### Get All Payments (Admin)
```
GET /payments/admin/all
Headers: Authorization: Bearer <admin_token>
```

### Verify Payment (Admin)
```
PUT /payments/:id/verify
Headers: Authorization: Bearer <admin_token>
```
Body:
```json
{
  "status": "Terverifikasi",
  "catatan": "Pembayaran dikonfirmasi"
}
```
Status options: Terverifikasi, Ditolak

---

## 5. BANK ENDPOINTS

### Get All Banks
```
GET /banks
```

### Create Bank (Admin)
```
POST /banks
Headers: Authorization: Bearer <admin_token>
```
Body:
```json
{
  "nama_bank": "Bank BCA",
  "nomor_rekening": "1234567890",
  "nama_pemilik": "SelempangKu Store"
}
```

### Update Bank (Admin)
```
PUT /banks/:id
Headers: Authorization: Bearer <admin_token>
```
Body:
```json
{
  "nama_bank": "Bank BCA",
  "nomor_rekening": "1234567890",
  "nama_pemilik": "SelempangKu Store",
  "status": "Aktif"
}
```

### Delete Bank (Admin)
```
DELETE /banks/:id
Headers: Authorization: Bearer <admin_token>
```

---

## 6. PROFILE ENDPOINTS

### Get Profile
```
GET /profile
Headers: Authorization: Bearer <token>
```

### Update Profile
```
PUT /profile
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- nama_lengkap: string
- nomor_telepon: string
- alamat: string
- jenis_kelamin: string (Laki-laki/Perempuan)
- foto_profil: file (optional)
```

### Change Password
```
PUT /profile/password
Headers: Authorization: Bearer <token>
```
Body:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

---

## 7. ADMIN ENDPOINTS

### Get Dashboard Stats
```
GET /admin/dashboard
Headers: Authorization: Bearer <admin_token>
```

### Get All Members
```
GET /admin/members
Headers: Authorization: Bearer <admin_token>
```

### Get Sales Reports
```
GET /admin/reports
Headers: Authorization: Bearer <admin_token>
```

### Get Daily Report
```
GET /admin/reports/daily
Headers: Authorization: Bearer <admin_token>
```

### Get Monthly Report
```
GET /admin/reports/monthly
Headers: Authorization: Bearer <admin_token>
```

---

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error message"
}
```

---

## Status Codes
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
