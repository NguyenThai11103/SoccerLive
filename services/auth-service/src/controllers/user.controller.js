import db from "../../config/database.js";

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db.queryOne(
      `SELECT u.id, u.email, u.tenDangNhap, u.hoTen, u.avatar, u.soDienThoai,
              u.canCuocCongDan, u.thoiGianTao, cv.tenChucVu as role
       FROM NGUOIDUNG u
       LEFT JOIN CHUCVU cv ON u.idChucVu = cv.id
       WHERE u.id = ? AND u.trangThai = 1`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: { message: "User không tồn tại" } });
    }

    // Don't send sensitive data
    delete user.matKhau;

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hoTen, soDienThoai, avatar } = req.body;

    const updateData = {};
    if (hoTen !== undefined) updateData.hoTen = hoTen;
    if (soDienThoai !== undefined) updateData.soDienThoai = soDienThoai;
    if (avatar !== undefined) updateData.avatar = avatar;
    updateData.thoiGianSua = new Date();

    await db.update("NGUOIDUNG", updateData, "id = ?", [userId]);

    // Get updated user
    const user = await db.queryOne(
      `SELECT u.id, u.email, u.tenDangNhap, u.hoTen, u.avatar, u.soDienThoai,
              cv.tenChucVu as role
       FROM NGUOIDUNG u
       LEFT JOIN CHUCVU cv ON u.idChucVu = cv.id
       WHERE u.id = ?`,
      [userId]
    );

    res.json({
      message: "Cập nhật thông tin thành công",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Get all users (Admin only)
 */
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE u.trangThai = 1";
    const params = [];

    if (search) {
      whereClause +=
        " AND (u.email LIKE ? OR u.tenDangNhap LIKE ? OR u.hoTen LIKE ?)";
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Get total count
    const countResult = await db.queryOne(
      `SELECT COUNT(*) as total FROM NGUOIDUNG u ${whereClause}`,
      params
    );

    // Get users
    const users = await db.query(
      `SELECT u.id, u.email, u.tenDangNhap, u.hoTen, u.avatar, u.soDienThoai,
              u.thoiGianTao, u.lanDangNhapCuoi, cv.tenChucVu as role
       FROM NGUOIDUNG u
       LEFT JOIN CHUCVU cv ON u.idChucVu = cv.id
       ${whereClause}
       ORDER BY u.thoiGianTao DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Get user by ID (Admin only)
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.queryOne(
      `SELECT u.id, u.email, u.tenDangNhap, u.hoTen, u.avatar, u.soDienThoai,
              u.canCuocCongDan, u.thoiGianTao, u.lanDangNhapCuoi, cv.tenChucVu as role
       FROM NGUOIDUNG u
       LEFT JOIN CHUCVU cv ON u.idChucVu = cv.id
       WHERE u.id = ?`,
      [id]
    );

    if (!user) {
      return res.status(404).json({ error: { message: "User không tồn tại" } });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};
