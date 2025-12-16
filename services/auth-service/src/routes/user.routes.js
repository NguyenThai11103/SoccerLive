import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", authenticate, userController.getProfile);

/**
 * @route   PATCH /users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.patch("/me", authenticate, userController.updateProfile);

/**
 * @route   GET /users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get("/", authenticate, requireRole("ADMIN"), userController.getUsers);

/**
 * @route   GET /users/:id
 * @desc    Get user by ID (Admin only)
 * @access  Private (Admin)
 */
router.get(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  userController.getUserById
);

export default router;
