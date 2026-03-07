const pool = require('../config/database');

const complaintRepository = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT c.id, c.citizen_id AS "citizenId", u.username AS "citizenName",
       c.description, c.status, c.date
       FROM complaints c JOIN users u ON c.citizen_id = u.id ORDER BY c.date DESC`
    );
    return rows;
  },

  async findByCitizen(citizenId) {
    const { rows } = await pool.query(
      'SELECT id, description, status, date FROM complaints WHERE citizen_id = $1 ORDER BY date DESC', [citizenId]
    );
    return rows;
  },

  async create({ citizenId, description }) {
    const { rows } = await pool.query(
      'INSERT INTO complaints (citizen_id, description) VALUES ($1,$2) RETURNING *',
      [citizenId, description]
    );
    return rows[0];
  },

  async resolve(id) {
    const { rows } = await pool.query(
      "UPDATE complaints SET status = 'RESOLVED' WHERE id = $1 RETURNING *", [id]
    );
    return rows[0];
  },
};

module.exports = complaintRepository;
