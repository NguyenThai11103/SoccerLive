import db from "../../config/database.js";

/**
 * Get notifications for current user
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, daDoc } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE idNguoiDung = ?";
    const params = [userId];

    if (daDoc !== undefined) {
      whereClause += " AND daDoc = ?";
      params.push(parseInt(daDoc));
    }

    const notifications = await db.query(
      `SELECT * FROM THONGBAO
       ${whereClause}
       ORDER BY thoiGianTao DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db.update("THONGBAO", { daDoc: 1 }, "id = ? AND idNguoiDung = ?", [
      id,
      userId,
    ]);

    res.json({ message: "Đánh dấu đã đọc thành công" });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Send notification (System use)
 */
export const sendNotification = async (req, res) => {
  try {
    const { idNguoiDung, tieuDe, noiDung, loai, idTranDau } = req.body;

    const notificationId = await db.insert("THONGBAO", {
      idNguoiDung: idNguoiDung || null,
      tieuDe,
      noiDung,
      loai: loai || "OTHER",
      idTranDau: idTranDau || null,
      daDoc: 0,
      thoiGianTao: new Date(),
    });

    res.status(201).json({ notificationId });
  } catch (error) {
    console.error("Send notification error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};
