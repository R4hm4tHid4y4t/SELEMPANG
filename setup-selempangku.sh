#!/bin/bash

# ============================================================
# SETUP SCRIPT - SISTEM INFORMASI PEMESANAN SELEMPANG
# SelempangKu v1.0
# ============================================================

echo "======================================"
echo "Setup Sistem SelempangKu"
echo "======================================"

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Create main project directory
echo -e "\n${YELLOW}[1/7]${NC} Membuat struktur folder proyek..."
mkdir -p selempangku
cd selempangku

# 2. Setup Backend Express.js
echo -e "\n${YELLOW}[2/7]${NC} Setup Backend Express.js..."
mkdir -p backend
cd backend

# Initialize npm
npm init -y

# Install dependencies
npm install express cors dotenv mysql2 bcryptjs jsonwebtoken multer nodemailer body-parser axios

# Create backend folder structure
mkdir -p src/{routes,controllers,middleware,config,models,utils}
mkdir -p uploads/{bukti_pembayaran,logo_kampus,produk}

# Create .env file
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=selempangku_new
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_this
JWT_EXPIRE=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@selempangku.com

# Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
EOF

cd ..

# 3. Setup Frontend React.js
echo -e "\n${YELLOW}[3/7]${NC} Setup Frontend React.js..."

npx create-react-app frontend --template cra

cd frontend

# Install additional dependencies
npm install axios react-router-dom react-icons react-toastify js-cookie zustand react-query date-fns

# Create frontend folder structure
mkdir -p src/{components,pages,services,contexts,hooks,utils,layouts,assets}
mkdir -p src/assets/{images,icons,styles}

cd ..

# 4. Create Database dump location
echo -e "\n${YELLOW}[4/7]${NC} Menyiapkan database..."
mkdir -p database

# Copy atau inform user tentang SQL file
echo "File database: selempangku_new.sql"
echo "Pastikan sudah ada di folder: $(pwd)/database/"

# 5. Create docker-compose for MySQL (optional)
echo -e "\n${YELLOW}[5/7]${NC} Membuat Docker Compose untuk MySQL..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  mysql:
    image: mysql:5.7
    container_name: selempangku_mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: selempangku_new
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database:/docker-entrypoint-initdb.d
    networks:
      - selempangku_network

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: selempangku_phpmyadmin
    environment:
      PMA_HOST: mysql
      PMA_USER: root
      PMA_PASSWORD: root
    ports:
      - "8080:80"
    depends_on:
      - mysql
    networks:
      - selempangku_network

volumes:
  mysql_data:

networks:
  selempangku_network:
    driver: bridge
EOF

# 6. Create README
echo -e "\n${YELLOW}[6/7]${NC} Membuat dokumentasi..."
cat > README.md << 'EOF'
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

EOF

cd ..

# 7. Create start scripts
echo -e "\n${YELLOW}[7/7]${NC} Membuat script startup..."

# Create start all script
cat > start.sh << 'EOF'
#!/bin/bash
echo "Starting SelempangKu Application..."
echo "1. Starting MySQL with Docker Compose..."
docker-compose up -d

echo "2. Starting Backend..."
cd backend
npm start &
BACKEND_PID=$!

echo "3. Starting Frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "======================================"
echo "SelempangKu is running!"
echo "======================================"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "phpMyAdmin: http://localhost:8080"
echo "======================================"
echo ""
echo "Press Ctrl+C to stop all services"

wait
EOF

chmod +x start.sh

# Create stop script
cat > stop.sh << 'EOF'
#!/bin/bash
echo "Stopping SelempangKu Application..."
docker-compose down
pkill -f "npm start"
echo "All services stopped!"
EOF

chmod +x stop.sh

# Summary
echo ""
echo -e "${GREEN}✓ Setup Selesai!${NC}"
echo ""
echo -e "${YELLOW}Langkah Selanjutnya:${NC}"
echo ""
echo "1. Masuk ke folder:"
echo "   cd selempangku"
echo ""
echo "2. Import Database:"
echo "   - Tempatkan file 'selempangku_new.sql' di folder 'database/'"
echo ""
echo "3. Start aplikasi dengan salah satu cara:"
echo ""
echo "   Cara 1 - Menggunakan script (Recommended):"
echo "   ./start.sh"
echo ""
echo "   Cara 2 - Manual:"
echo "   docker-compose up -d                    # Start MySQL"
echo "   cd backend && npm start                 # Terminal 1"
echo "   cd frontend && npm start                # Terminal 2"
echo ""
echo "4. Akses aplikasi:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000"
echo "   phpMyAdmin: http://localhost:8080 (root/root)"
echo ""
echo -e "${GREEN}Happy coding!${NC}"
