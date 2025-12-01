-- ============================================================
-- DATABASE SCHEMA - SELEMPANGKU
-- Sistem Informasi Pemesanan Selempang
-- ============================================================

-- Drop existing database if exists
DROP DATABASE IF EXISTS selempangku_new;
CREATE DATABASE selempangku_new;
USE selempangku_new;

-- Set timezone
SET time_zone = "+07:00";

-- ============================================================
-- TABLE: user
-- Menyimpan data user (Customer & Admin)
-- ============================================================
CREATE TABLE `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nama_lengkap` VARCHAR(100) DEFAULT NULL,
  `nomor_telepon` VARCHAR(20) DEFAULT NULL,
  `alamat` VARCHAR(255) DEFAULT NULL,
  `jenis_kelamin` ENUM('Laki-laki', 'Perempuan') DEFAULT NULL,
  `foto_profil` VARCHAR(100) DEFAULT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'Customer',
  `is_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: otp_verification
-- Menyimpan kode OTP untuk verifikasi email
-- ============================================================
CREATE TABLE `otp_verification` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `otp` VARCHAR(10) NOT NULL,
  `type` ENUM('register', 'reset_password') DEFAULT 'register',
  `expires_at` TIMESTAMP NOT NULL,
  `is_used` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email_otp` (`email`, `otp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: produk
-- Menyimpan data produk selempang
-- ============================================================
CREATE TABLE `produk` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nama_produk` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT DEFAULT NULL,
  `harga` DECIMAL(10,2) NOT NULL,
  `stok` INT(11) DEFAULT 100,
  `gambar_produk` VARCHAR(100) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_nama_produk` (`nama_produk`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: rekening_bank
-- Menyimpan data rekening bank untuk pembayaran
-- ============================================================
CREATE TABLE `rekening_bank` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nama_bank` VARCHAR(100) NOT NULL,
  `nomor_rekening` VARCHAR(50) NOT NULL UNIQUE,
  `nama_pemilik` VARCHAR(100) NOT NULL,
  `logo_bank` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: pemesanan
-- Menyimpan data pesanan
-- ============================================================
CREATE TABLE `pemesanan` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nomor_pesanan` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT(11) NOT NULL,
  `produk_id` INT(11) NOT NULL,
  `jumlah` INT(11) NOT NULL DEFAULT 1,
  `harga_satuan` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `ongkir` DECIMAL(10,2) DEFAULT 0.00,
  `total_harga` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Pending', 'Verifikasi', 'Proses', 'Terkirim', 'Selesai', 'Dibatalkan') DEFAULT 'Pending',
  `alamat_pengiriman` VARCHAR(255) NOT NULL,
  `catatan` TEXT DEFAULT NULL,
  `tanggal_pesanan` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`produk_id`) REFERENCES `produk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_nomor_pesanan` (`nomor_pesanan`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: detail_pesanan
-- Menyimpan detail selempang (nama, gelar, dll)
-- ============================================================
CREATE TABLE `detail_pesanan` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `pesanan_id` INT(11) NOT NULL,
  `nama_selempang` VARCHAR(100) NOT NULL,
  `gelar` VARCHAR(50) DEFAULT NULL,
  `kampus_sekolah` VARCHAR(100) DEFAULT NULL,
  `jurusan` VARCHAR(100) DEFAULT NULL,
  `tahun_tamat` VARCHAR(10) DEFAULT NULL,
  `logo_kampus` VARCHAR(255) DEFAULT NULL,
  `warna_selempang` VARCHAR(50) DEFAULT NULL,
  `catatan_desain` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`pesanan_id`) REFERENCES `pemesanan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_pesanan_id` (`pesanan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: pembayaran
-- Menyimpan data pembayaran
-- ============================================================
CREATE TABLE `pembayaran` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `pesanan_id` INT(11) NOT NULL,
  `rekening_id` INT(11) DEFAULT NULL,
  `metode_pembayaran` VARCHAR(50) NOT NULL,
  `bank_pengirim` VARCHAR(100) DEFAULT NULL,
  `nomor_rekening` VARCHAR(50) DEFAULT NULL,
  `nama_pengirim` VARCHAR(100) DEFAULT NULL,
  `jumlah_transfer` DECIMAL(10,2) NOT NULL,
  `bukti_pembayaran` VARCHAR(255) DEFAULT NULL,
  `status_pembayaran` ENUM('Pending', 'Terverifikasi', 'Ditolak') DEFAULT 'Pending',
  `tanggal_pembayaran` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `tanggal_verifikasi` TIMESTAMP NULL DEFAULT NULL,
  `catatan` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`pesanan_id`) REFERENCES `pemesanan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`rekening_id`) REFERENCES `rekening_bank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_pesanan_id` (`pesanan_id`),
  INDEX `idx_status_pembayaran` (`status_pembayaran`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: laporan_penjualan
-- Menyimpan laporan penjualan harian
-- ============================================================
CREATE TABLE `laporan_penjualan` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `tanggal` DATE NOT NULL UNIQUE,
  `total_penjualan` INT(11) DEFAULT 0,
  `total_pendapatan` DECIMAL(12,2) DEFAULT 0.00,
  `jumlah_pesanan` INT(11) DEFAULT 0,
  `rata_rata_nilai_pesanan` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_tanggal` (`tanggal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TRIGGER: Auto generate nomor pesanan
-- ============================================================
DELIMITER $$
CREATE TRIGGER `before_insert_pemesanan` 
BEFORE INSERT ON `pemesanan` 
FOR EACH ROW 
BEGIN
    DECLARE next_id INT;
    SELECT IFNULL(MAX(id), 0) + 1 INTO next_id FROM pemesanan;
    SET NEW.nomor_pesanan = CONCAT('ORD-', LPAD(next_id, 6, '0'));
END$$
DELIMITER ;

-- ============================================================
-- TRIGGER: Update laporan saat pesanan selesai
-- ============================================================
DELIMITER $$
CREATE TRIGGER `after_update_pemesanan_status` 
AFTER UPDATE ON `pemesanan` 
FOR EACH ROW 
BEGIN
    IF NEW.status = 'Selesai' AND OLD.status != 'Selesai' THEN
        INSERT INTO laporan_penjualan (tanggal, total_penjualan, total_pendapatan, jumlah_pesanan, rata_rata_nilai_pesanan)
        VALUES (DATE(NEW.tanggal_pesanan), NEW.jumlah, NEW.total_harga, 1, NEW.total_harga)
        ON DUPLICATE KEY UPDATE
            total_penjualan = total_penjualan + NEW.jumlah,
            total_pendapatan = total_pendapatan + NEW.total_harga,
            jumlah_pesanan = jumlah_pesanan + 1,
            rata_rata_nilai_pesanan = (total_pendapatan + NEW.total_harga) / (jumlah_pesanan + 1);
    END IF;
END$$
DELIMITER ;

-- ============================================================
-- VIEW: Dashboard Statistics
-- ============================================================
CREATE VIEW `v_dashboard_stats` AS
SELECT 
    COUNT(DISTINCT p.id) AS total_pesanan,
    COUNT(DISTINCT CASE WHEN p.status = 'Pending' THEN p.id END) AS pesanan_pending,
    COUNT(DISTINCT CASE WHEN p.status = 'Verifikasi' THEN p.id END) AS pesanan_verifikasi,
    COUNT(DISTINCT CASE WHEN p.status = 'Proses' THEN p.id END) AS pesanan_proses,
    COUNT(DISTINCT CASE WHEN p.status = 'Terkirim' THEN p.id END) AS pesanan_terkirim,
    COUNT(DISTINCT CASE WHEN p.status = 'Selesai' THEN p.id END) AS pesanan_selesai,
    (SELECT COUNT(*) FROM user WHERE role = 'Customer') AS total_member,
    (SELECT COUNT(*) FROM pembayaran WHERE status_pembayaran = 'Pending') AS pembayaran_pending,
    (SELECT COUNT(*) FROM produk WHERE is_active = 1) AS total_produk,
    COALESCE(SUM(CASE WHEN p.status = 'Selesai' THEN p.total_harga END), 0) AS total_pendapatan
FROM pemesanan p;

-- ============================================================
-- STORED PROCEDURE: Create Order
-- ============================================================
DELIMITER $$
CREATE PROCEDURE `sp_create_pesanan` (
    IN p_user_id INT, 
    IN p_produk_id INT, 
    IN p_jumlah INT, 
    IN p_alamat_pengiriman VARCHAR(255), 
    IN p_ongkir DECIMAL(10,2), 
    OUT p_pesanan_id INT, 
    OUT p_nomor_pesanan VARCHAR(50)
)
BEGIN
    DECLARE v_harga_satuan DECIMAL(10,2);
    DECLARE v_subtotal DECIMAL(10,2);
    DECLARE v_total_harga DECIMAL(10,2);

    -- Get harga produk
    SELECT harga INTO v_harga_satuan FROM produk WHERE id = p_produk_id;

    -- Calculate totals
    SET v_subtotal = v_harga_satuan * p_jumlah;
    SET v_total_harga = v_subtotal + p_ongkir;

    -- Insert pesanan
    INSERT INTO pemesanan (user_id, produk_id, jumlah, harga_satuan, subtotal, ongkir, total_harga, alamat_pengiriman, status)
    VALUES (p_user_id, p_produk_id, p_jumlah, v_harga_satuan, v_subtotal, p_ongkir, v_total_harga, p_alamat_pengiriman, 'Pending');

    -- Get generated ID and nomor pesanan
    SET p_pesanan_id = LAST_INSERT_ID();
    SELECT nomor_pesanan INTO p_nomor_pesanan FROM pemesanan WHERE id = p_pesanan_id;
END$$
DELIMITER ;

-- ============================================================
-- STORED PROCEDURE: Verify Payment
-- ============================================================
DELIMITER $$
CREATE PROCEDURE `sp_verifikasi_pembayaran` (
    IN p_pembayaran_id INT, 
    IN p_status VARCHAR(20)
)
BEGIN
    DECLARE v_pesanan_id INT;

    -- Update status pembayaran
    UPDATE pembayaran 
    SET status_pembayaran = p_status, 
        tanggal_verifikasi = NOW()
    WHERE id = p_pembayaran_id;

    -- Jika terverifikasi, update status pesanan
    IF p_status = 'Terverifikasi' THEN
        SELECT pesanan_id INTO v_pesanan_id FROM pembayaran WHERE id = p_pembayaran_id;
        UPDATE pemesanan SET status = 'Proses' WHERE id = v_pesanan_id;
    END IF;
END$$
DELIMITER ;

-- ============================================================
-- SEED DATA: Admin User
-- ============================================================
INSERT INTO `user` (`email`, `username`, `password`, `nama_lengkap`, `role`, `is_verified`) VALUES
('admin@selempangku.com', 'admin', '$2b$10$rQZ8K.7.8Xx1QkO9XhB5aeL0Yh0mG5cYFQj3xZzF3UWvPqZ5Yt2Ym', 'Administrator', 'Admin', 1);
-- Password: admin123

-- ============================================================
-- SEED DATA: Products
-- ============================================================
INSERT INTO `produk` (`nama_produk`, `deskripsi`, `harga`, `stok`, `gambar_produk`) VALUES
('Selempang Wisuda Merah Emas', 'Selempang wisuda premium dengan bordir emas berkualitas tinggi', 75000.00, 100, 'selempang-merah-emas.jpg'),
('Selempang Wisuda Biru Silver', 'Selempang wisuda dengan aksen silver elegan', 65000.00, 100, 'selempang-biru-silver.jpg'),
('Selempang Event Hijau', 'Selempang untuk event dengan desain elegan', 45000.00, 100, 'selempang-event-hijau.jpg'),
('Selempang Custom Ungu', 'Selempang custom dengan desain sesuai permintaan', 95000.00, 100, 'selempang-custom-ungu.jpg'),
('Selempang Wisuda Putih', 'Selempang wisuda dengan striping biru premium', 55000.00, 100, 'selempang-wisuda-putih.jpg');

-- ============================================================
-- SEED DATA: Bank Accounts
-- ============================================================
INSERT INTO `rekening_bank` (`nama_bank`, `nomor_rekening`, `nama_pemilik`, `status`) VALUES
('Bank BCA', '1234567890', 'SelempangKu Store', 'Aktif'),
('Bank Mandiri', '0987654321', 'SelempangKu Store', 'Aktif'),
('Bank BNI', '1122334455', 'SelempangKu Store', 'Aktif');
