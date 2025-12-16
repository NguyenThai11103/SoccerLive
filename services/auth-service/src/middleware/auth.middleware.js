import jwt from "jsonwebtoken";
import db from "../../config/database.js";

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: { message: "Token không được cung cấp" },
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await db.queryOne(
      `SELECT u.id, u.email, u.tenDangNhap, cv.tenChucVu as role
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

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: { message: "Token không hợp lệ" } });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: { message: "Token đã hết hạn" } });
    }
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: { message: "Lỗi xác thực" } });
  }
};

/**
 * Check if user has required role
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: { message: "Chưa xác thực" },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: { message: "Không có quyền truy cập" },
      });
    }

    next();
  };
};

/**
 * Check if user has specific permission
 */
export const requirePermission = (permissionCode) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: "Chưa xác thực" },
        });
      }

      // Get user's role ID
      const user = await db.queryOne(
        "SELECT idChucVu FROM NGUOIDUNG WHERE id = ?",
        [req.user.id]
      );

      if (!user) {
        return res.status(401).json({
          error: { message: "User không tồn tại" },
        });
      }

      // Check if role has permission
      const permission = await db.queryOne(
        `SELECT cp.* FROM CHITIETPHANQUYEN cp
         JOIN CHUCNANG cn ON cp.idChucNang = cn.id
         WHERE cp.idChucVu = ? AND cn.maChucNang = ?`,
        [user.idChucVu, permissionCode]
      );

      if (!permission) {
        return res.status(403).json({
          error: { message: "Không có quyền thực hiện thao tác này" },
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ error: { message: "Lỗi kiểm tra quyền" } });
    }
  };
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.queryOne(
      `SELECT u.id, u.email, u.tenDangNhap, cv.tenChucVu as role
       FROM NGUOIDUNG u
       LEFT JOIN CHUCVU cv ON u.idChucVu = cv.id
       WHERE u.id = ? AND u.trangThai = 1`,
      [decoded.id]
    );

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};
