// API Login Example for Frontend
// File: client/src/services/authService.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Đăng ký tài khoản mới
 * @param {Object} userData - Thông tin người dùng
 * @param {string} userData.username - Tên đăng nhập (3-50 ký tự)
 * @param {string} userData.email - Email
 * @param {string} userData.password - Mật khẩu (tối thiểu 6 ký tự)
 * @param {string} userData.fullName - Họ tên (optional)
 * @returns {Promise<Object>} Response với user và token
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Đăng ký thất bại");
    }

    // Lưu token vào localStorage
    if (data.data.token) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

/**
 * Đăng nhập
 * @param {Object} credentials - Thông tin đăng nhập
 * @param {string} credentials.email - Email
 * @param {string} credentials.password - Mật khẩu
 * @returns {Promise<Object>} Response với user và token
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }

    // Lưu token vào localStorage
    if (data.data.token) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Lấy thông tin user hiện tại
 * @returns {Promise<Object>} Thông tin user
 */
export const getMe = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Chưa đăng nhập");
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Token hết hạn hoặc không hợp lệ
      if (response.status === 401) {
        logout();
      }
      throw new Error(data.message || "Lấy thông tin thất bại");
    }

    return data;
  } catch (error) {
    console.error("Get me error:", error);
    throw error;
  }
};

/**
 * Đăng xuất
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

/**
 * Kiểm tra xem user đã đăng nhập chưa
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Lấy token hiện tại
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Lấy user hiện tại từ localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Export tất cả
export default {
  register,
  login,
  getMe,
  logout,
  isAuthenticated,
  getToken,
  getCurrentUser,
};
