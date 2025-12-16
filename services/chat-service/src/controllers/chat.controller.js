import db from "../../config/database.js";

/**
 * Get messages for a match
 */
export const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { limit = 100, before } = req.query;

    let whereClause = "WHERE tn.idTranDau = ? AND tn.trangThai = 1";
    const params = [matchId];

    if (before) {
      whereClause += " AND tn.id < ?";
      params.push(before);
    }

    const messages = await db.query(
      `SELECT tn.*, nd.tenDangNhap, nd.avatar
       FROM TINNHAN tn
       LEFT JOIN NGUOIDUNG nd ON tn.idNguoiDung = nd.id
       ${whereClause}
       ORDER BY tn.thoiGianTao DESC
       LIMIT ?`,
      [...params, parseInt(limit)]
    );

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Send message
 */
export const sendMessage = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { noiDung } = req.body;
    const userId = req.user.id;

    const messageId = await db.insert("TINNHAN", {
      idTranDau: matchId,
      idNguoiDung: userId,
      noiDung,
      trangThai: 1,
      thoiGianTao: new Date(),
    });

    const message = await db.queryOne(
      `SELECT tn.*, nd.tenDangNhap, nd.avatar
       FROM TINNHAN tn
       LEFT JOIN NGUOIDUNG nd ON tn.idNguoiDung = nd.id
       WHERE tn.id = ?`,
      [messageId]
    );

    res.status(201).json({ message });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};

/**
 * Delete message (Moderator only)
 */
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await db.update("TINNHAN", { trangThai: 0 }, "id = ?", [id]);

    res.json({ message: "Xóa tin nhắn thành công" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ error: { message: "Lỗi server" } });
  }
};
