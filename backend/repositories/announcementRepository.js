const pool = require('../config/database');

const announcementRepository = {
  async findAll() {
    const { rows } = await pool.query('SELECT id, title, content, language, date FROM announcements ORDER BY date DESC');
    return rows;
  },

  async create({ title, content, language }) {
    const { rows } = await pool.query(
      'INSERT INTO announcements (title, content, language) VALUES ($1,$2,$3) RETURNING *',
      [title, content, language]
    );
    return rows[0];
  },

  async update(id, { title, content, language }) {
    const { rows } = await pool.query(
      'UPDATE announcements SET title=COALESCE($1,title), content=COALESCE($2,content), language=COALESCE($3,language) WHERE id=$4 RETURNING *',
      [title, content, language, id]
    );
    return rows[0];
  },
};

module.exports = announcementRepository;
