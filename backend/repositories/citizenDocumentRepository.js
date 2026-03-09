const pool = require("../config/database");

const citizenDocumentRepository = {
  async findByCitizen(citizenId) {
    const { rows } = await pool.query(
      'SELECT id, file_path AS "filePath", document_type AS "documentType", created_at AS "createdAt" FROM citizen_documents WHERE citizen_id = $1 ORDER BY created_at DESC',
      [citizenId],
    );
    return rows;
  },

  async create({ citizenId, filePath, documentType }) {
    const { rows } = await pool.query(
      "INSERT INTO citizen_documents (citizen_id, file_path, document_type) VALUES ($1,$2,$3) RETURNING *",
      [citizenId, filePath, documentType],
    );
    return rows[0];
  },
};

module.exports = citizenDocumentRepository;
