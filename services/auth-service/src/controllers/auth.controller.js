import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import db from "../../config/database.js";

/**
 * Register new user
 */
export const register = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, tenDangNhap, matKhau, hoTen, soDienThoai } = req.body;

    // Check if email already exists
    const existingUser = await db.queryOne(
      "SELECT id FROM NGUOIDUNG WHERE email = ?",
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        error: { message: "Email đã được sử dụng", field: "email" },
      });
    }

    // Check if username already exists
    const existingUsername = await db.queryOne(
      "SELECT id FROM NGUOIDUNG WHERE tenDangNhap = ?",
      [tenDangNhap]
    );

    if (existingUsername) {
      return res.status(400).json({
        error: {
          message: "Tên đăng nhập đã được sử dụng",
          field: "tenDangNhap",
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(matKhau, 10);

    // Insert user (default role: VIEWER = 2)
    const userId = await db.insert("NGUOIDUNG", {
      email,
      tenDangNhap,
      matKhau: hashedPassword,
      hoTen: hoTen || tenDangNhap,
      soDienThoai: soDienThoai || null,
      idChucVu: 2, // VIEWER role
      trangThai: 1,
      thoiGianTao: new Date(),
      thoiGianSua: new Date(),
    });

    // Get user with role info
    const user = await db.queryOne(
      `SELECT u.id, u.email, u.tenDangNhap, u.hoTen, u.avatar, u.soDienThoai,
              cv.tenChucVu as role
       FROM NGUOIDUNG u
       LEFT JOIN CHUCVU cv ON u.idChucVu = cv.id
       WHERE u.id = ?`,
      [userId]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: user.id,
        email: user.email,
        tenDangNhap: user.tenDangNhap,
        hoTen: user.hoTen,
        avatar: user.avatar,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: { message: "Lỗi server khi đăng ký" } });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, matKhau } = req.body;

    // Get user with role
    const user = await db.queryOne(
      `SELECT u.*, cv.tenChucVu as role
       FROM NGUOIDUNG u
       LEFT JOIN CHUCVU cv ON u.idChucVu = cv.id
       WHERE u.email = ? AND u.trangThai = 1`,
      [email]
    );

    if (!user) {
      return res.status(401).json({
        error: { message: "Email hoặc mật khẩu không đúng" },
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(matKhau, user.matKhau);
    if (!isValidPassword) {
      return res.status(401).json({
        error: { message: "Email hoặc mật khẩu không đúng" },
      });
    }

    // Update last login time
    await db.update("NGUOIDUNG", { lanDangNhapCuoi: new Date() }, "id = ?", [
      user.id,
    ]);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    });

    res.json({
      message: "Đăng nhập thành công",
      user: {
        id: user.id,
        email: user.email,
        tenDangNhap: user.tenDangNhap,
        hoTen: user.hoTen,
        avatar: user.avatar,
        role: user.role,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: { message: "Lỗi server khi đăng nhập" } });
  }
};

/**
 * Refresh JWT token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: { message: "Refresh token không được cung cấp" },
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Get user
    const user = await db.queryOne(
      `SELECT u.id, u.email, cv.tenChucVu as role
       FROM NGUOIDUNG u
       LEFT JOIN CHUCVU cv ON u.idChucVu = cv.id
       WHERE u.id = ? AND u.trangThai = 1`,
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({
        error: { message: "User không tồn tại hoặc đã bị vô hiệu hóa" },
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      token: newToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ error: { message: "Refresh token không hợp lệ" } });
  }
};

/**
 * Logout (client-side token removal, optional server-side blacklist)
 */
export const logout = async (req, res) => {
  // In a production app, you might want to blacklist the token in Redis
  res.json({ message: "Đăng xuất thành công" });
};
