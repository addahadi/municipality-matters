const pool = require('../config/database');

const reviewRepository = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT r.id, r.citizen_id AS "citizenId", u.username AS "citizenName",
       r.content, r.status, r.date
       FROM reviews r JOIN users u ON r.citizen_id = u.id ORDER BY r.date DESC`
    );
    return rows;
  },

  async findByCitizen(citizenId) {
    const { rows } = await pool.query(
      'SELECT id, content, status, date FROM reviews WHERE citizen_id = $1 ORDER BY date DESC', [citizenId]
    );
    return rows;
  },

  async create({ citizenId, content }) {
    const { rows } = await pool.query(
      'INSERT INTO reviews (citizen_id, content) VALUES ($1,$2) RETURNING *',
      [citizenId, content]
    );
    return rows[0];
  },

  async hide(id) {
    const { rows } = await pool.query(
      "UPDATE reviews SET status = 'HIDDEN' WHERE id = $1 RETURNING *", [id]
    );
    return rows[0];
  },
};

module.exports = reviewRepository;
