const pool = require('../config/database');

const messageRepository = {
  async findByUser(userId) {
    const { rows } = await pool.query(
      `SELECT m.id, m.sender_id AS "senderId", m.receiver_id AS "receiverId",
       s.username AS "senderName", r.username AS "receiverName",
       m.content, m.date, m.read_status AS "readStatus"
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       ORDER BY m.date DESC`, [userId]
    );
    return rows;
  },

  async create({ senderId, receiverId, content }) {
    const { rows } = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1,$2,$3) RETURNING *',
      [senderId, receiverId, content]
    );
    return rows[0];
  },

  async markAsRead(id) {
    const { rows } = await pool.query(
      'UPDATE messages SET read_status = TRUE WHERE id = $1 RETURNING *', [id]
    );
    return rows[0];
  },
};

module.exports = messageRepository;
