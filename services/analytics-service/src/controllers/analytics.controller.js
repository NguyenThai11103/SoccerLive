import db from "../../config/database.js";

/**
 * Get analytics for a specific match
 */
export const getMatchAnalytics = async (req, res) => {
  try {
    const { matchId } = req.params;

    const analytics = await db.queryOne(
      `SELECT * FROM THONGKE WHERE idTranDau = ?`,
      [matchId]
    );

    if (!analytics) {
      return res.status(404).json({
        error: { message: "Chưa có dữ liệu thống kê cho trận đấu này" },
      });
    }

    res.json({ analytics });
  } catch (error) {
    console.error("Get match analytics error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Get dashboard overview
 */
export const getDashboard = async (req, res) => {
  try {
    // Total matches
    const totalMatches = await db.queryOne(
      "SELECT COUNT(*) as count FROM TRANDAU"
    );

    // Total users
    const totalUsers = await db.queryOne(
      "SELECT COUNT(*) as count FROM NGUOIDUNG WHERE trangThai = 1"
    );

    // Total views
    const totalViews = await db.queryOne(
      "SELECT SUM(tongLuotXem) as total FROM THONGKE"
    );

    // Recent matches with stats
    const recentMatches = await db.query(
      `SELECT td.*, tk.tongLuotXem, tk.luotXemDongThoi_Max,
              dn.tenDoiBong as doiNha, dk.tenDoiBong as doiKhach
       FROM TRANDAU td
       LEFT JOIN THONGKE tk ON td.id = tk.idTranDau
       LEFT JOIN DOIBONG dn ON td.idDoiNha = dn.id
       LEFT JOIN DOIBONG dk ON td.idDoiKhach = dk.id
       ORDER BY td.thoiGianBatDau DESC
       LIMIT 10`
    );

    res.json({
      dashboard: {
        totalMatches: totalMatches.count,
        totalUsers: totalUsers.count,
        totalViews: totalViews.total || 0,
        recentMatches,
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Export report (placeholder)
 */
export const exportReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await db.query(
      `SELECT * FROM THONGKE 
       WHERE ngayThongKe BETWEEN ? AND ?
       ORDER BY ngayThongKe DESC`,
      [startDate, endDate]
    );

    res.json({ stats });
  } catch (error) {
    console.error("Export report error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};
