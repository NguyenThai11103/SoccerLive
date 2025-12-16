import express from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("tenDangNhap")
      .isLength({ min: 3, max: 50 })
      .withMessage("Tên đăng nhập phải từ 3-50 ký tự"),
    body("matKhau")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
    body("hoTen").optional().isLength({ max: 255 }),
    body("soDienThoai").optional().isMobilePhone("vi-VN"),
  ],
  authController.register
);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("matKhau").notEmpty().withMessage("Mật khẩu không được để trống"),
  ],
  authController.login
);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh JWT token
 * @access  Public
 */
router.post("/refresh", authController.refreshToken);

/**
 * @route   POST /auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post("/logout", authController.logout);

export default router;
