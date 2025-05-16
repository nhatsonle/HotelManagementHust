const db = require('./index');

// Lấy tất cả feedback
exports.getAllFeedbacks = async () => {
  const result = await db.query(`
    SELECT f.*, g.name AS guest_name, r.room_number
    FROM feedbacks f
    JOIN guests g ON f.guest_id = g.guest_id
    JOIN rooms r ON f.room_id = r.room_id
    ORDER BY f.created_at DESC
  `);
  return result.rows;
};

// Lấy 5 feedback mới nhất (cho dashboard)
exports.getRecentFeedbacks = async () => {
  const result = await db.query(`
    SELECT f.comment, g.name AS guest_name, r.room_number
    FROM feedbacks f
    JOIN guests g ON f.guest_id = g.guest_id
    JOIN rooms r ON f.room_id = r.room_id
    ORDER BY f.created_at DESC
    LIMIT 5
  `);
  return result.rows;
};

// Thêm mới feedback
exports.createFeedback = async (guest_id, room_id, comment) => {
  const result = await db.query(
    `INSERT INTO feedbacks (guest_id, room_id, comment) 
     VALUES ($1, $2, $3) RETURNING *`,
    [guest_id, room_id, comment]
  );
  return result.rows[0];
};

// Xoá feedback
exports.deleteFeedback = async (feedback_id) => {
  await db.query('DELETE FROM feedbacks WHERE feedback_id = $1', [feedback_id]);
};
