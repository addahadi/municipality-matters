const pool = require('../config/database');

const requestRepository = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT r.id, r.citizen_id AS "citizenId", u.username AS "citizenName",
       r.type, r.description, r.status, r.date
       FROM requests r JOIN users u ON r.citizen_id = u.id ORDER BY r.date DESC`
    );
    return rows;
  },

  async findByCitizen(citizenId) {
    const { rows } = await pool.query(
      'SELECT id, type, description, status, date FROM requests WHERE citizen_id = $1 ORDER BY date DESC', [citizenId]
    );
    return rows;
  },

  async create({ citizenId, type, description }) {
    const { rows } = await pool.query(
      'INSERT INTO requests (citizen_id, type, description) VALUES ($1,$2,$3) RETURNING *',
      [citizenId, type, description]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *', [status, id]
    );
    return rows[0];
  },
};

module.exports = requestRepository;
