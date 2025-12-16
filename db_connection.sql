
-- SoccerLive Database Schema
-- Live Football Streaming Platform

-- Drop tables if they already exist
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS LICHSUXEMTRAN, THONGKE, TINNHAN, TRANDAU_SUKIEN, THONGBAO, 
    LUOTXEM, TRANDAU, DOIBONG, NGUOIDUNG, CHUCVU, CHUCNANG, CHITIETPHANQUYEN;
SET FOREIGN_KEY_CHECKS = 1;

-- Bảng CHUCVU (Roles)
CREATE TABLE CHUCVU (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenChucVu VARCHAR(50) NOT NULL,
    moTa VARCHAR(255),
    trangThai INT DEFAULT 1,
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    thoiGianSua DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng CHUCNANG (Permissions/Functions)
CREATE TABLE CHUCNANG (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenChucNang VARCHAR(100) NOT NULL,
    maChucNang VARCHAR(50) UNIQUE,
    moTa VARCHAR(255),
    trangThai INT DEFAULT 1,
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    thoiGianSua DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng CHITIETPHANQUYEN (Role-Permission mapping)
CREATE TABLE CHITIETPHANQUYEN (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idChucVu BIGINT NOT NULL,
    idChucNang BIGINT NOT NULL,
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    thoiGianSua DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idChucVu) REFERENCES CHUCVU(id) ON DELETE CASCADE,
    FOREIGN KEY (idChucNang) REFERENCES CHUCNANG(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (idChucVu, idChucNang)
);

-- Bảng NGUOIDUNG (Users)
CREATE TABLE NGUOIDUNG (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    tenDangNhap VARCHAR(100) NOT NULL UNIQUE,
    matKhau VARCHAR(255) NOT NULL,
    hoTen VARCHAR(255),
    avatar VARCHAR(255),
    soDienThoai VARCHAR(20),
    idChucVu BIGINT DEFAULT 2, -- Default: VIEWER
    trangThai INT DEFAULT 1,
    lanDangNhapCuoi DATETIME,
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    thoiGianSua DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idChucVu) REFERENCES CHUCVU(id)
);

-- Bảng DOIBONG (Teams)
CREATE TABLE DOIBONG (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenDoiBong VARCHAR(255) NOT NULL,
    logo VARCHAR(255),
    quocGia VARCHAR(100),
    sanNha VARCHAR(255),
    hlv VARCHAR(255),
    moTa TEXT,
    trangThai INT DEFAULT 1,
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    thoiGianSua DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng TRANDAU (Matches)
CREATE TABLE TRANDAU (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idDoiNha BIGINT NOT NULL,
    idDoiKhach BIGINT NOT NULL,
    tiSoDoiNha INT DEFAULT 0,
    tiSoDoiKhach INT DEFAULT 0,
    trangThai ENUM('UPCOMING', 'LIVE', 'FINISHED', 'CANCELLED') DEFAULT 'UPCOMING',
    thoiGianBatDau DATETIME NOT NULL,
    thoiGianKetThuc DATETIME,
    streamKey VARCHAR(255) UNIQUE NOT NULL,
    streamUrl VARCHAR(255),
    thumbnail VARCHAR(255),
    giaiDau VARCHAR(255),
    muaGiai VARCHAR(100),
    sanVanDong VARCHAR(255),
    soLuotXem INT DEFAULT 0,
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    thoiGianSua DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idDoiNha) REFERENCES DOIBONG(id),
    FOREIGN KEY (idDoiKhach) REFERENCES DOIBONG(id),
    INDEX idx_trang_thai (trangThai),
    INDEX idx_thoi_gian_bat_dau (thoiGianBatDau)
);

-- Bảng TRANDAU_SUKIEN (Match Events)
CREATE TABLE TRANDAU_SUKIEN (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idTranDau BIGINT NOT NULL,
    loaiSuKien ENUM('GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION', 'PENALTY', 'VAR', 'INJURY', 'OTHER') NOT NULL,
    doiBong ENUM('HOME', 'AWAY') NOT NULL,
    tenCauThu VARCHAR(255),
    phut INT NOT NULL,
    phutBoSung INT DEFAULT 0,
    moTa TEXT,
    duLieuBosung JSON,
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idTranDau) REFERENCES TRANDAU(id) ON DELETE CASCADE,
    INDEX idx_tran_dau (idTranDau),
    INDEX idx_phut (phut)
);

-- Bảng LUOTXEM (Viewer Stats)
CREATE TABLE LUOTXEM (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idTranDau BIGINT NOT NULL,
    idNguoiDung BIGINT,
    thoiGianVao DATETIME DEFAULT CURRENT_TIMESTAMP,
    thoiGianRa DATETIME,
    thoiLuongXem INT, -- Tính bằng giây
    diaChi_IP VARCHAR(45),
    thietBi VARCHAR(100),
    trinh_duyet VARCHAR(100),
    FOREIGN KEY (idTranDau) REFERENCES TRANDAU(id) ON DELETE CASCADE,
    FOREIGN KEY (idNguoiDung) REFERENCES NGUOIDUNG(id) ON DELETE SET NULL,
    INDEX idx_tran_dau (idTranDau),
    INDEX idx_nguoi_dung (idNguoiDung),
    INDEX idx_thoi_gian_vao (thoiGianVao)
);

-- Bảng THONGBAO (Notifications)
CREATE TABLE THONGBAO (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idNguoiDung BIGINT,
    tieuDe VARCHAR(255) NOT NULL,
    noiDung TEXT NOT NULL,
    loai ENUM('MATCH_START', 'GOAL', 'MATCH_END', 'SYSTEM', 'OTHER') DEFAULT 'OTHER',
    idTranDau BIGINT,
    daDoc INT DEFAULT 0,
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idNguoiDung) REFERENCES NGUOIDUNG(id) ON DELETE CASCADE,
    FOREIGN KEY (idTranDau) REFERENCES TRANDAU(id) ON DELETE SET NULL,
    INDEX idx_nguoi_dung (idNguoiDung),
    INDEX idx_da_doc (daDoc)
);

-- Bảng TINNHAN (Chat Messages)
CREATE TABLE TINNHAN (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idTranDau BIGINT NOT NULL,
    idNguoiDung BIGINT NOT NULL,
    noiDung TEXT NOT NULL,
    trangThai INT DEFAULT 1, -- 1: Active, 0: Deleted/Hidden
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idTranDau) REFERENCES TRANDAU(id) ON DELETE CASCADE,
    FOREIGN KEY (idNguoiDung) REFERENCES NGUOIDUNG(id) ON DELETE CASCADE,
    INDEX idx_tran_dau (idTranDau),
    INDEX idx_thoi_gian_tao (thoiGianTao)
);

-- Bảng THONGKE (Analytics)
CREATE TABLE THONGKE (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idTranDau BIGINT NOT NULL,
    tongLuotXem INT DEFAULT 0,
    luotXemDongThoi_Max INT DEFAULT 0,
    tongThoiLuongXem BIGINT DEFAULT 0, -- Tổng giây
    soLuongTinNhan INT DEFAULT 0,
    soLuongNguoiDung_DangKy INT DEFAULT 0,
    soLuongNguoiDung_KhachVangLai INT DEFAULT 0,
    duLieuBoSung JSON,
    ngayThongKe DATE NOT NULL,
    thoiGianCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idTranDau) REFERENCES TRANDAU(id) ON DELETE CASCADE,
    UNIQUE KEY unique_match_date (idTranDau, ngayThongKe),
    INDEX idx_ngay_thong_ke (ngayThongKe)
);

-- Bảng LICHSUXEMTRAN (View History)
CREATE TABLE LICHSUXEMTRAN (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idNguoiDung BIGINT NOT NULL,
    idTranDau BIGINT NOT NULL,
    lanXemCuoi DATETIME DEFAULT CURRENT_TIMESTAMP,
    soLanXem INT DEFAULT 1,
    thoiGianTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    thoiGianSua DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idNguoiDung) REFERENCES NGUOIDUNG(id) ON DELETE CASCADE,
    FOREIGN KEY (idTranDau) REFERENCES TRANDAU(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_match (idNguoiDung, idTranDau),
    INDEX idx_lan_xem_cuoi (lanXemCuoi)
);

-- Insert default roles
INSERT INTO CHUCVU (tenChucVu, moTa) VALUES
('ADMIN', 'Quản trị viên hệ thống'),
('VIEWER', 'Người xem thông thường'),
('MODERATOR', 'Người kiểm duyệt nội dung');

-- Insert default permissions
INSERT INTO CHUCNANG (tenChucNang, maChucNang, moTa) VALUES
('Quản lý trận đấu', 'MANAGE_MATCHES', 'Tạo, sửa, xóa trận đấu'),
('Quản lý đội bóng', 'MANAGE_TEAMS', 'Tạo, sửa, xóa đội bóng'),
('Quản lý người dùng', 'MANAGE_USERS', 'Quản lý tài khoản người dùng'),
('Kiểm duyệt chat', 'MODERATE_CHAT', 'Xóa tin nhắn không phù hợp'),
('Xem thống kê', 'VIEW_ANALYTICS', 'Xem báo cáo thống kê'),
('Xem trận đấu', 'VIEW_MATCHES', 'Xem livestream trận đấu'),
('Gửi tin nhắn', 'SEND_MESSAGES', 'Gửi tin nhắn trong chat');

-- Assign permissions to roles
-- ADMIN: All permissions
INSERT INTO CHITIETPHANQUYEN (idChucVu, idChucNang) 
SELECT 1, id FROM CHUCNANG;

-- VIEWER: View matches and send messages
INSERT INTO CHITIETPHANQUYEN (idChucVu, idChucNang) VALUES
(2, 6), -- VIEW_MATCHES
(2, 7); -- SEND_MESSAGES

-- MODERATOR: View matches, send messages, moderate chat, view analytics
INSERT INTO CHITIETPHANQUYEN (idChucVu, idChucNang) VALUES
(3, 4), -- MODERATE_CHAT
(3, 5), -- VIEW_ANALYTICS
(3, 6), -- VIEW_MATCHES
(3, 7); -- SEND_MESSAGES

-- Create default admin account (password: admin123 - hashed with bcrypt)
INSERT INTO NGUOIDUNG (email, tenDangNhap, matKhau, hoTen, idChucVu) VALUES
('admin@soccerlive.com', 'admin', '$2b$10$YourHashedPasswordHere', 'Administrator', 1);

SET FOREIGN_KEY_CHECKS = 1;
