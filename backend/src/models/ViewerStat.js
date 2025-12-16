import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";

const ViewerStat = sequelize.define(
  "ViewerStat",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    matchId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "matches",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    sessionId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    joinTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    leaveTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Duration in seconds",
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "viewer_stats",
    timestamps: true,
    indexes: [
      { fields: ["matchId"] },
      { fields: ["userId"] },
      { fields: ["sessionId"] },
      { fields: ["joinTime"] },
    ],
  }
);

export default ViewerStat;
