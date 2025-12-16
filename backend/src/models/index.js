import sequelize from "../config/connectDB.js";
import User from "./User.js";
import Match from "./Match.js";
import MatchEvent from "./MatchEvent.js";
import ChatMessage from "./ChatMessage.js";
import ViewerStat from "./ViewerStat.js";

// Define associations
Match.hasMany(MatchEvent, {
  foreignKey: "matchId",
  as: "events",
  onDelete: "CASCADE",
});
MatchEvent.belongsTo(Match, {
  foreignKey: "matchId",
  as: "match",
});

Match.hasMany(ChatMessage, {
  foreignKey: "matchId",
  as: "chatMessages",
  onDelete: "CASCADE",
});
ChatMessage.belongsTo(Match, {
  foreignKey: "matchId",
  as: "match",
});

User.hasMany(ChatMessage, {
  foreignKey: "userId",
  as: "chatMessages",
  onDelete: "CASCADE",
});
ChatMessage.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Match.hasMany(ViewerStat, {
  foreignKey: "matchId",
  as: "viewerStats",
  onDelete: "CASCADE",
});
ViewerStat.belongsTo(Match, {
  foreignKey: "matchId",
  as: "match",
});

User.hasMany(ViewerStat, {
  foreignKey: "userId",
  as: "viewerStats",
  onDelete: "SET NULL",
});
ViewerStat.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

const db = {
  sequelize,
  User,
  Match,
  MatchEvent,
  ChatMessage,
  ViewerStat,
};

export default db;
