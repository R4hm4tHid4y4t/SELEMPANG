-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 29, 2025 at 05:08 AM
-- Server version: 5.7.39
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `selempangku_new`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_pesanan` (IN `p_user_id` INT, IN `p_produk_id` INT, IN `p_jumlah` INT, IN `p_alamat_pengiriman` VARCHAR(255), IN `p_ongkir` DECIMAL(10,2), OUT `p_pesanan_id` INT, OUT `p_nomor_pesanan` VARCHAR(50))   BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_verifikasi_pembayaran` (IN `p_pembayaran_id` INT, IN `p_status` VARCHAR(20))   BEGIN
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

-- --------------------------------------------------------

--
-- Table structure for table `detail_pesanan`
--

CREATE TABLE `detail_pesanan` (
  `id` int(11) NOT NULL,
  `pesanan_id` int(11) NOT NULL,
  `nama_selempang` varchar(100) NOT NULL,
  `gelar` varchar(50) DEFAULT NULL,
  `kampus_sekolah` varchar(100) DEFAULT NULL,
  `jurusan` varchar(100) DEFAULT NULL,
  `tahun_tamat` varchar(10) DEFAULT NULL,
  `logo_kampus` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `laporan_penjualan`
--

CREATE TABLE `laporan_penjualan` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `total_penjualan` int(11) DEFAULT '0',
  `total_pendapatan` decimal(12,2) DEFAULT '0.00',
  `jumlah_pesanan` int(11) DEFAULT '0',
  `rata_rata_nilai_pesanan` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id` int(11) NOT NULL,
  `pesanan_id` int(11) NOT NULL,
  `metode_pembayaran` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_pengirim` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomor_rekening` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jumlah_transfer` decimal(10,2) NOT NULL,
  `bukti_pembayaran` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_pembayaran` enum('Pending','Terverifikasi','Ditolak') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `tanggal_pembayaran` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tanggal_verifikasi` timestamp NULL DEFAULT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pemesanan`
--

CREATE TABLE `pemesanan` (
  `id` int(11) NOT NULL,
  `nomor_pesanan` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `produk_id` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL DEFAULT '1',
  `harga_satuan` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `ongkir` decimal(10,2) DEFAULT '0.00',
  `total_harga` decimal(10,2) NOT NULL,
  `status` enum('Pending','Verifikasi','Proses','Terkirim','Selesai','Dibatalkan') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `alamat_pengiriman` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_pesanan` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `pemesanan`
--
DELIMITER $$
CREATE TRIGGER `after_update_pemesanan_status` AFTER UPDATE ON `pemesanan` FOR EACH ROW BEGIN
    IF NEW.status = 'Selesai' AND OLD.status != 'Selesai' THEN
        INSERT INTO laporan_penjualan (tanggal, total_penjualan, total_pendapatan, jumlah_pesanan, rata_rata_nilai_pesanan)
        VALUES (DATE(NEW.tanggal_pesanan), NEW.jumlah, NEW.total_harga, 1, NEW.total_harga)
        ON DUPLICATE KEY UPDATE
            total_penjualan = total_penjualan + NEW.jumlah,
            total_pendapatan = total_pendapatan + NEW.total_harga,
            jumlah_pesanan = jumlah_pesanan + 1,
            rata_rata_nilai_pesanan = (total_pendapatan + NEW.total_harga) / (jumlah_pesanan + 1);
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_insert_pemesanan` BEFORE INSERT ON `pemesanan` FOR EACH ROW BEGIN
    DECLARE next_id INT;
    SELECT IFNULL(MAX(id), 0) + 1 INTO next_id FROM pemesanan;
    SET NEW.nomor_pesanan = CONCAT('ORD-', LPAD(next_id, 6, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id` int(11) NOT NULL,
  `nama_produk` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `harga` decimal(10,2) NOT NULL,
  `gambar_produk` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id`, `nama_produk`, `deskripsi`, `harga`, `gambar_produk`, `created_at`, `updated_at`) VALUES
(1, 'Selempang Wisuda Merah Emas', 'Selempang wisuda premium dengan bordir emas', '75000.00', 'selempang-merah-emas.jpg', '2025-11-26 02:43:01', '2025-11-26 02:43:01'),
(2, 'Selempang Wisuda Biru Silver', 'Selempang wisuda dengan aksen silver', '65000.00', 'selempang-biru-silver.jpg', '2025-11-26 02:43:01', '2025-11-26 02:43:01'),
(3, 'Selempang Event Hijau', 'Selempang untuk event dengan desain elegan', '45000.00', 'selempang-event-hijau.jpg', '2025-11-26 02:43:01', '2025-11-26 02:43:01'),
(4, 'Selempang Custom Ungu', 'Selempang custom dengan desain sesuai permintaan', '95000.00', 'selempang-custom-ungu.jpg', '2025-11-26 02:43:01', '2025-11-26 02:43:01'),
(5, 'Selempang Wisuda Putih', 'Selempang wisuda dengan striping biru', '55000.00', 'selempang-wisuda-putih.jpg', '2025-11-26 02:43:01', '2025-11-26 02:43:01');

-- --------------------------------------------------------

--
-- Table structure for table `rekening_bank`
--

CREATE TABLE `rekening_bank` (
  `id` int(11) NOT NULL,
  `nama_bank` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomor_rekening` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_pemilik` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Aktif','Nonaktif') COLLATE utf8mb4_unicode_ci DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rekening_bank`
--

INSERT INTO `rekening_bank` (`id`, `nama_bank`, `nomor_rekening`, `nama_pemilik`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Bank BCA', '1234567890', 'SelempangKu Store', 'Aktif', '2025-11-26 02:43:01', '2025-11-26 02:43:01'),
(2, 'Bank Mandiri', '0987654321', 'SelempangKu Store', 'Aktif', '2025-11-26 02:43:01', '2025-11-26 02:43:01');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_lengkap` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomor_telepon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_profil` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Customer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `username`, `password`, `nama_lengkap`, `nomor_telepon`, `alamat`, `jenis_kelamin`, `foto_profil`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin@selempangku.com', 'admin', '$2b$10$example_hashed_password', 'Admin User', NULL, NULL, NULL, NULL, 'Admin', '2025-11-26 02:43:01', '2025-11-26 02:43:01'),
(2, 'customer@example.com', 'customer1', '$2b$10$example_hashed_password', 'John Doe', NULL, NULL, NULL, NULL, 'Customer', '2025-11-26 02:43:01', '2025-11-26 02:43:01');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_dashboard_stats`
-- (See below for the actual view)
--
CREATE TABLE `v_dashboard_stats` (
`total_pesanan` bigint(21)
,`pesanan_pending` bigint(21)
,`pesanan_proses` bigint(21)
,`pesanan_terkirim` bigint(21)
,`pesanan_selesai` bigint(21)
,`total_member` bigint(21)
,`pembayaran_pending` bigint(21)
,`total_produk` bigint(21)
,`total_pendapatan` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Structure for view `v_dashboard_stats`
--
DROP TABLE IF EXISTS `v_dashboard_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_dashboard_stats`  AS SELECT count(distinct `p`.`id`) AS `total_pesanan`, count(distinct (case when (`p`.`status` = 'Pending') then `p`.`id` end)) AS `pesanan_pending`, count(distinct (case when (`p`.`status` = 'Proses') then `p`.`id` end)) AS `pesanan_proses`, count(distinct (case when (`p`.`status` = 'Terkirim') then `p`.`id` end)) AS `pesanan_terkirim`, count(distinct (case when (`p`.`status` = 'Selesai') then `p`.`id` end)) AS `pesanan_selesai`, count(distinct `u`.`id`) AS `total_member`, count(distinct `pb`.`id`) AS `pembayaran_pending`, count(distinct `pr`.`id`) AS `total_produk`, coalesce(sum((case when (`p`.`status` = 'Selesai') then `p`.`total_harga` end)),0) AS `total_pendapatan` FROM (((`pemesanan` `p` left join `user` `u` on(((`p`.`user_id` = `u`.`id`) and (`u`.`role` = 'Customer')))) left join `pembayaran` `pb` on(((`p`.`id` = `pb`.`pesanan_id`) and (`pb`.`status_pembayaran` = 'Pending')))) left join `produk` `pr` on((1 = 1)))  ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pesanan_id` (`pesanan_id`);

--
-- Indexes for table `laporan_penjualan`
--
ALTER TABLE `laporan_penjualan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_tanggal` (`tanggal`),
  ADD KEY `idx_tanggal` (`tanggal`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pesanan_id` (`pesanan_id`),
  ADD KEY `idx_status_pembayaran` (`status_pembayaran`);

--
-- Indexes for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_pesanan` (`nomor_pesanan`),
  ADD KEY `produk_id` (`produk_id`),
  ADD KEY `idx_nomor_pesanan` (`nomor_pesanan`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_nama_produk` (`nama_produk`);

--
-- Indexes for table `rekening_bank`
--
ALTER TABLE `rekening_bank`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_rekening` (`nomor_rekening`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `laporan_penjualan`
--
ALTER TABLE `laporan_penjualan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pemesanan`
--
ALTER TABLE `pemesanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `rekening_bank`
--
ALTER TABLE `rekening_bank`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD CONSTRAINT `detail_pesanan_ibfk_1` FOREIGN KEY (`pesanan_id`) REFERENCES `pemesanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`pesanan_id`) REFERENCES `pemesanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD CONSTRAINT `pemesanan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pemesanan_ibfk_2` FOREIGN KEY (`produk_id`) REFERENCES `produk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
