import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";

const MatchEvent = sequelize.define(
  "MatchEvent",
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
    type: {
      type: DataTypes.ENUM(
        "GOAL",
        "YELLOW_CARD",
        "RED_CARD",
        "SUBSTITUTION",
        "PENALTY",
        "VAR",
        "INJURY",
        "OTHER"
      ),
      allowNull: false,
    },
    team: {
      type: DataTypes.ENUM("HOME", "AWAY"),
      allowNull: false,
    },
    player: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    minute: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "match_events",
    timestamps: true,
    indexes: [
      { fields: ["matchId"] },
      { fields: ["type"] },
      { fields: ["minute"] },
    ],
  }
);

export default MatchEvent;
