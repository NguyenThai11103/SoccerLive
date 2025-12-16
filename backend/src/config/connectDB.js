import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "soccerlive",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    timezone: "+07:00",
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(">>> KẾT NỐI DATABASE THÀNH CÔNG ✓");

    // Sync models in development
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false });
      console.log(">>> ĐỒNG BỘ MODELS THÀNH CÔNG ✓");
    }
  } catch (error) {
    console.error(">>> LỖI KẾT NỐI DATABASE:", error.message);
    process.exit(1);
  }
};

export default sequelize;
