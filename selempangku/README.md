# SISTEM INFORMASI PEMESANAN SELEMPANG (SelempangKu)

## Struktur Proyek

```
selempangku/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Authentication, validation
│   │   ├── config/         # Database config
│   │   ├── models/         # Database queries
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Entry point
│   ├── uploads/            # File storage
│   ├── .env               # Environment variables
│   └── package.json
│
├── frontend/               # React.js UI
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   ├── contexts/      # Context API
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── App.js
│   └── package.json
│
├── database/              # SQL files
│   └── selempangku_new.sql
│
├── docker-compose.yml     # MySQL & phpMyAdmin
└── README.md
```

## Setup Awal

### Prasyarat
- Node.js >= 14.x
- MySQL 5.7+
- Docker & Docker Compose (opsional)

### Instalasi

1. **Database Setup**
   ```bash
   # Gunakan Docker Compose (recommended)
   docker-compose up -d
   
   # Atau setup manual MySQL
   # Import database:
   mysql -u root -p selempangku_new < database/selempangku_new.sql
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   # Server berjalan di http://localhost:5000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   # App berjalan di http://localhost:3000
   ```

## Akun Default

- **Admin**: admin@selempangku.com / admin123
- **Customer**: customer@example.com / customer123

## Fitur Utama

### User (Customer)
- [x] Registrasi & Email Verification
- [x] Login/Logout
- [x] Lupa Password
- [x] Dashboard
- [x] Katalog Produk
- [x] Detail Produk
- [x] Pemesanan
- [x] Pembayaran
- [x] Profile
- [x] Riwayat Pesanan

### Admin
- [x] Login
- [x] Dashboard
- [x] Kelola Rekening Bank
- [x] Kelola Produk
- [x] Daftar Member
- [x] Verifikasi Pembayaran
- [x] Daftar Pesanan
- [x] Laporan Penjualan

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/verify-email
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (Admin)
- PUT /api/products/:id (Admin)
- DELETE /api/products/:id (Admin)

### Orders
- POST /api/orders
- GET /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id/status (Admin)

### Payments
- POST /api/payments
- GET /api/payments
- PUT /api/payments/:id/verify (Admin)

### Admin
- GET /api/admin/dashboard
- GET /api/admin/reports

## Port Configuration

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MySQL**: localhost:3306
- **phpMyAdmin**: http://localhost:8080

## Troubleshooting

### Database Connection Error
- Pastikan MySQL running: `docker-compose up -d`
- Check .env file di backend

### CORS Error
- Pastikan backend running
- Check CORS configuration di backend/src/server.js

### Port Already in Use
- Change port di .env atau gunakan: `lsof -i :PORT` untuk check process
