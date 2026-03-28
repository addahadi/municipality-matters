const pool = require("../config/database");

const citizenDocumentRepository = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT cd.id, cd.file_path AS "filePath", cd.document_type AS "documentType", cd.created_at AS "createdAt",
       cd.citizen_id AS "citizenId", u.username AS "citizenName"
       FROM citizen_documents cd
       LEFT JOIN users u ON u.id = cd.citizen_id
       ORDER BY cd.created_at DESC`,
    );
    return rows;
  },

  async findByCitizen(citizenId) {
    const { rows } = await pool.query(
      'SELECT id, file_path AS "filePath", document_type AS "documentType", created_at AS "createdAt" FROM citizen_documents WHERE citizen_id = $1 ORDER BY created_at DESC',
      [citizenId],
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, citizen_id AS "citizenId", file_path AS "filePath", document_type AS "documentType", created_at AS "createdAt" FROM citizen_documents WHERE id = $1',
      [id],
    );
    return rows[0];
  },

  async create({ citizenId, filePath, documentType }) {
    const { rows } = await pool.query(
      "INSERT INTO citizen_documents (citizen_id, file_path, document_type) VALUES ($1,$2,$3) RETURNING *",
      [citizenId, filePath, documentType],
    );
    return rows[0];
  },

  async update(id, { documentType }) {
    const { rows } = await pool.query(
      'UPDATE citizen_documents SET document_type = $1 WHERE id = $2 RETURNING id, file_path AS "filePath", document_type AS "documentType", created_at AS "createdAt"',
      [documentType, id],
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query(
      "DELETE FROM citizen_documents WHERE id = $1 RETURNING id",
      [id],
    );
    return rows[0];
  },
};

module.exports = citizenDocumentRepository;
