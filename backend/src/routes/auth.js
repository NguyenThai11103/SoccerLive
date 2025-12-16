import express from "express";
import AuthController from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post(
  "/register",
  AuthController.registerValidation,
  AuthController.register
);
router.post("/login", AuthController.loginValidation, AuthController.login);

// Protected routes
router.get("/me", verifyToken, AuthController.getMe);

export default router;
