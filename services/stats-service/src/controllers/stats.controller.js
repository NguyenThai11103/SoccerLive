import db from "../../config/database.js";

/**
 * Track viewer joining a match
 */
export const trackView = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user?.id || null;
    const { diaChi_IP, thietBi, trinh_duyet } = req.body;

    const viewId = await db.insert("LUOTXEM", {
      idTranDau: matchId,
      idNguoiDung: userId,
      diaChi_IP,
      thietBi,
      trinh_duyet,
      thoiGianVao: new Date(),
    });

    // Update match viewer count
    await db.query(
      "UPDATE TRANDAU SET soLuotXem = soLuotXem + 1 WHERE id = ?",
      [matchId]
    );

    res.status(201).json({ viewId });
  } catch (error) {
    console.error("Track view error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Update view when user leaves
 */
export const endView = async (req, res) => {
  try {
    const { viewId } = req.params;

    const view = await db.queryOne("SELECT * FROM LUOTXEM WHERE id = ?", [
      viewId,
    ]);

    if (view) {
      const thoiLuongXem = Math.floor(
        (new Date() - new Date(view.thoiGianVao)) / 1000
      );

      await db.update(
        "LUOTXEM",
        { thoiGianRa: new Date(), thoiLuongXem },
        "id = ?",
        [viewId]
      );
    }

    res.json({ message: "Cập nhật lượt xem thành công" });
  } catch (error) {
    console.error("End view error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Get current viewer count for a match
 */
export const getViewerCount = async (req, res) => {
  try {
    const { matchId } = req.params;

    const result = await db.queryOne(
      `SELECT COUNT(*) as count 
       FROM LUOTXEM 
       WHERE idTranDau = ? AND thoiGianRa IS NULL`,
      [matchId]
    );

    res.json({ viewerCount: result.count });
  } catch (error) {
    console.error("Get viewer count error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Get view history for a user
 */
export const getViewHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const history = await db.query(
      `SELECT lx.*, td.giaiDau, td.thoiGianBatDau,
              dn.tenDoiBong as doiNha, dk.tenDoiBong as doiKhach
       FROM LICHSUXEMTRAN lx
       LEFT JOIN TRANDAU td ON lx.idTranDau = td.id
       LEFT JOIN DOIBONG dn ON td.idDoiNha = dn.id
       LEFT JOIN DOIBONG dk ON td.idDoiKhach = dk.id
       WHERE lx.idNguoiDung = ?
       ORDER BY lx.lanXemCuoi DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), offset]
    );

    res.json({ history });
  } catch (error) {
    console.error("Get view history error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};
