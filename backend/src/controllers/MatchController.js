import { Op } from "sequelize";
import { body, validationResult } from "express-validator";
import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

const { Match, MatchEvent } = db;

class MatchController {
  // Validation rules
  static createValidation = [
    body("homeTeam")
      .trim()
      .notEmpty()
      .withMessage("Đội nhà không được để trống"),
    body("awayTeam")
      .trim()
      .notEmpty()
      .withMessage("Đội khách không được để trống"),
    body("startTime").isISO8601().withMessage("Thời gian bắt đầu không hợp lệ"),
  ];

  // Get all matches
  static getAll = async (req, res) => {
    try {
      const { status, limit = 20, offset = 0 } = req.query;

      const where = {};
      if (status) {
        where.status = status;
      }

      const matches = await Match.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["startTime", "DESC"]],
        include: [
          {
            model: MatchEvent,
            as: "events",
            limit: 10,
            order: [["minute", "DESC"]],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        data: {
          matches: matches.rows,
          total: matches.count,
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      });
    } catch (error) {
      console.error("Get matches error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  };

  // Get live matches
  static getLive = async (req, res) => {
    try {
      const matches = await Match.findAll({
        where: { status: "LIVE" },
        order: [["startTime", "ASC"]],
        include: [
          {
            model: MatchEvent,
            as: "events",
            limit: 10,
            order: [["minute", "DESC"]],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        data: { matches },
      });
    } catch (error) {
      console.error("Get live matches error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  };

  // Get match by ID
  static getById = async (req, res) => {
    try {
      const { id } = req.params;

      const match = await Match.findByPk(id, {
        include: [
          {
            model: MatchEvent,
            as: "events",
            order: [["minute", "ASC"]],
          },
        ],
      });

      if (!match) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy trận đấu",
        });
      }

      return res.status(200).json({
        success: true,
        data: { match },
      });
    } catch (error) {
      console.error("Get match error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  };

  // Create match (Admin only)
  static create = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { homeTeam, awayTeam, startTime, league, venue, thumbnail } =
        req.body;

      // Generate stream key
      const streamKey = `match_${uuidv4()}`;

      const match = await Match.create({
        homeTeam,
        awayTeam,
        startTime,
        league,
        venue,
        thumbnail,
        streamKey,
        status: "SCHEDULED",
      });

      return res.status(201).json({
        success: true,
        message: "Tạo trận đấu thành công",
        data: { match },
      });
    } catch (error) {
      console.error("Create match error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  };

  // Update match status (Admin only)
  static updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const match = await Match.findByPk(id);

      if (!match) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy trận đấu",
        });
      }

      await match.update({ status });

      // Emit socket event
      const io = req.app.get("io");
      io.to(`match-${id}`).emit("match-status-updated", {
        matchId: id,
        status,
      });

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái thành công",
        data: { match },
      });
    } catch (error) {
      console.error("Update match status error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  };

  // Update score (Admin only)
  static updateScore = async (req, res) => {
    try {
      const { id } = req.params;
      const { homeScore, awayScore } = req.body;

      const match = await Match.findByPk(id);

      if (!match) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy trận đấu",
        });
      }

      await match.update({ homeScore, awayScore });

      // Emit socket event
      const io = req.app.get("io");
      io.to(`match-${id}`).emit("score-updated", {
        matchId: id,
        homeScore,
        awayScore,
      });

      return res.status(200).json({
        success: true,
        message: "Cập nhật tỷ số thành công",
        data: { match },
      });
    } catch (error) {
      console.error("Update score error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  };
}

export default MatchController;
