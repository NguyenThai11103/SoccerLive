import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./src/config/connectDB.js";
import { connectRedis } from "./src/config/connectRedis.js";
import initRoutes from "./src/routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Make io accessible to routes
app.set("io", io);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "SoccerLive Backend",
  });
});

// Initialize routes
initRoutes(app);

// Connect to database and Redis
connectDB();
connectRedis();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`>>> Socket connected: ${socket.id}`);

  // Join match room
  socket.on("join-match", (matchId) => {
    socket.join(`match-${matchId}`);
    console.log(`Socket ${socket.id} joined match-${matchId}`);
  });

  // Leave match room
  socket.on("leave-match", (matchId) => {
    socket.leave(`match-${matchId}`);
    console.log(`Socket ${socket.id} left match-${matchId}`);
  });

  socket.on("disconnect", () => {
    console.log(`>>> Socket disconnected: ${socket.id}`);
  });
});

// Start server
const startServer = () => {
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`\n>>> SERVER ĐÃ SẴN SÀNG TẠI CỔNG ${port} <<<\n`);
    console.log(`>>> Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(
      `>>> Client URL: ${process.env.CLIENT_URL || "http://localhost:5173"}\n`
    );
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `\nLỗi: Cổng ${port} đang được sử dụng. Vui lòng đóng ứng dụng khác đang dùng cổng này và thử lại.\n`
      );
      process.exit(1);
    } else {
      console.error("Lỗi khi khởi động server:", err);
      process.exit(1);
    }
  });
};

console.log("--- KHỞI ĐỘNG SOCCERLIVE BACKEND ---");
startServer();

export { io };
