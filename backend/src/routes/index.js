import authRoutes from "./auth.js";
import matchRoutes from "./match.js";

const initRoutes = (app) => {
  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/matches", matchRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route không tồn tại",
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Lỗi server",
    });
  });
};

export default initRoutes;
