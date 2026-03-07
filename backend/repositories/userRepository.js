const pool = require('../config/database');

const userRepository = {
  async findByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT id, username, national_id AS "nationalId", role, created_at AS "createdAt" FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async findAll() {
    const { rows } = await pool.query('SELECT id, username, national_id AS "nationalId", role, created_at AS "createdAt" FROM users ORDER BY created_at DESC');
    return rows;
  },

  async create({ username, nationalId, password, role }) {
    const { rows } = await pool.query(
      'INSERT INTO users (username, national_id, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, national_id AS "nationalId", role, created_at AS "createdAt"',
      [username, nationalId, password, role]
    );
    return rows[0];
  },

  async update(id, { username, role }) {
    const { rows } = await pool.query(
      'UPDATE users SET username = COALESCE($1, username), role = COALESCE($2, role) WHERE id = $3 RETURNING id, username, national_id AS "nationalId", role',
      [username, role, id]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  },
};

module.exports = userRepository;
