import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";

const Match = sequelize.define(
  "Match",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    homeTeam: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    awayTeam: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    homeScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    awayScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("SCHEDULED", "LIVE", "FINISHED", "CANCELLED"),
      defaultValue: "SCHEDULED",
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    streamKey: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    streamUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    league: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    venue: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    viewerCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "matches",
    timestamps: true,
    indexes: [
      { fields: ["status"] },
      { fields: ["startTime"] },
      { fields: ["streamKey"] },
    ],
  }
);

export default Match;
