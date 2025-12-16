import express from "express";
import MatchController from "../controllers/MatchController.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", MatchController.getAll);
router.get("/live", MatchController.getLive);
router.get("/:id", MatchController.getById);

// Admin routes
router.post(
  "/",
  verifyToken,
  isAdmin,
  MatchController.createValidation,
  MatchController.create
);
router.patch("/:id/status", verifyToken, isAdmin, MatchController.updateStatus);
router.patch("/:id/score", verifyToken, isAdmin, MatchController.updateScore);

export default router;
