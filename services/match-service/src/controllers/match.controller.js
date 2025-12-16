import db from "../../config/database.js";

/**
 * Get all matches with filters
 */
export const getMatches = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, giaiDau } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params = [];

    if (status) {
      whereClause += " AND td.trangThai = ?";
      params.push(status);
    }

    if (giaiDau) {
      whereClause += " AND td.giaiDau = ?";
      params.push(giaiDau);
    }

    const matches = await db.query(
      `SELECT td.*, 
              dn.tenDoiBong as doiNha, dn.logo as logoDoiNha,
              dk.tenDoiBong as doiKhach, dk.logo as logoDoiKhach
       FROM TRANDAU td
       LEFT JOIN DOIBONG dn ON td.idDoiNha = dn.id
       LEFT JOIN DOIBONG dk ON td.idDoiKhach = dk.id
       ${whereClause}
       ORDER BY td.thoiGianBatDau DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ matches });
  } catch (error) {
    console.error("Get matches error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Get live matches
 */
export const getLiveMatches = async (req, res) => {
  try {
    const matches = await db.query(
      `SELECT td.*, 
              dn.tenDoiBong as doiNha, dn.logo as logoDoiNha,
              dk.tenDoiBong as doiKhach, dk.logo as logoDoiKhach
       FROM TRANDAU td
       LEFT JOIN DOIBONG dn ON td.idDoiNha = dn.id
       LEFT JOIN DOIBONG dk ON td.idDoiKhach = dk.id
       WHERE td.trangThai = 'LIVE'
       ORDER BY td.thoiGianBatDau DESC`
    );

    res.json({ matches });
  } catch (error) {
    console.error("Get live matches error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Get match by ID
 */
export const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await db.queryOne(
      `SELECT td.*, 
              dn.tenDoiBong as doiNha, dn.logo as logoDoiNha,
              dk.tenDoiBong as doiKhach, dk.logo as logoDoiKhach
       FROM TRANDAU td
       LEFT JOIN DOIBONG dn ON td.idDoiNha = dn.id
       LEFT JOIN DOIBONG dk ON td.idDoiKhach = dk.id
       WHERE td.id = ?`,
      [id]
    );

    if (!match) {
      return res
        .status(404)
        .json({ error: { message: "Trận đấu không tồn tại" } });
    }

    // Get match events
    const events = await db.query(
      `SELECT * FROM TRANDAU_SUKIEN 
       WHERE idTranDau = ? 
       ORDER BY phut ASC, phutBoSung ASC`,
      [id]
    );

    res.json({ match: { ...match, events } });
  } catch (error) {
    console.error("Get match by ID error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Create new match (Admin only)
 */
export const createMatch = async (req, res) => {
  try {
    const {
      idDoiNha,
      idDoiKhach,
      thoiGianBatDau,
      giaiDau,
      muaGiai,
      sanVanDong,
    } = req.body;

    // Generate unique stream key
    const streamKey = `match_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const matchId = await db.insert("TRANDAU", {
      idDoiNha,
      idDoiKhach,
      thoiGianBatDau: new Date(thoiGianBatDau),
      streamKey,
      giaiDau: giaiDau || null,
      muaGiai: muaGiai || null,
      sanVanDong: sanVanDong || null,
      trangThai: "UPCOMING",
      thoiGianTao: new Date(),
      thoiGianSua: new Date(),
    });

    const match = await db.queryOne(
      `SELECT td.*, 
              dn.tenDoiBong as doiNha, dn.logo as logoDoiNha,
              dk.tenDoiBong as doiKhach, dk.logo as logoDoiKhach
       FROM TRANDAU td
       LEFT JOIN DOIBONG dn ON td.idDoiNha = dn.id
       LEFT JOIN DOIBONG dk ON td.idDoiKhach = dk.id
       WHERE td.id = ?`,
      [matchId]
    );

    res.status(201).json({
      message: "Tạo trận đấu thành công",
      match,
    });
  } catch (error) {
    console.error("Create match error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Update match status
 */
export const updateMatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;

    const validStatuses = ["UPCOMING", "LIVE", "FINISHED", "CANCELLED"];
    if (!validStatuses.includes(trangThai)) {
      return res.status(400).json({
        error: { message: "Trạng thái không hợp lệ" },
      });
    }

    const updateData = { trangThai, thoiGianSua: new Date() };

    if (trangThai === "FINISHED") {
      updateData.thoiGianKetThuc = new Date();
    }

    await db.update("TRANDAU", updateData, "id = ?", [id]);

    const match = await db.queryOne("SELECT * FROM TRANDAU WHERE id = ?", [id]);

    res.json({
      message: "Cập nhật trạng thái thành công",
      match,
    });
  } catch (error) {
    console.error("Update match status error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Update match score
 */
export const updateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { tiSoDoiNha, tiSoDoiKhach } = req.body;

    await db.update(
      "TRANDAU",
      {
        tiSoDoiNha,
        tiSoDoiKhach,
        thoiGianSua: new Date(),
      },
      "id = ?",
      [id]
    );

    const match = await db.queryOne("SELECT * FROM TRANDAU WHERE id = ?", [id]);

    res.json({
      message: "Cập nhật tỷ số thành công",
      match,
    });
  } catch (error) {
    console.error("Update score error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};
