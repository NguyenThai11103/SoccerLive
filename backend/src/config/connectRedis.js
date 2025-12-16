import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
  legacyMode: false,
});

redisClient.on("error", (err) => {
  console.error(">>> REDIS ERROR:", err.message);
});

redisClient.on("connect", () => {
  console.log(">>> KẾT NỐI REDIS THÀNH CÔNG ✓");
});

redisClient.on("ready", () => {
  console.log(">>> REDIS SẴN SÀNG ✓");
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error(">>> LỖI KẾT NỐI REDIS:", error.message);
    console.log(
      ">>> Tiếp tục chạy mà không có Redis (một số tính năng có thể bị giới hạn)"
    );
  }
};

export default redisClient;
