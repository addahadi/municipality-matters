const pool = require('../config/database');

const invoiceRepository = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT i.id, i.citizen_id AS "citizenId", u.username AS "citizenName",
       i.total, i.amount_paid AS "amountPaid", i.remaining_amount AS "remainingAmount",
       i.status, i.created_at AS "createdAt"
       FROM invoices i JOIN users u ON i.citizen_id = u.id ORDER BY i.created_at DESC`
    );
    return rows;
  },

  async findByCitizen(citizenId) {
    const { rows } = await pool.query(
      `SELECT id, total, amount_paid AS "amountPaid", remaining_amount AS "remainingAmount", status, created_at AS "createdAt"
       FROM invoices WHERE citizen_id = $1 ORDER BY created_at DESC`, [citizenId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create({ citizenId, propertyId, total, description }) {
    const { rows } = await pool.query(
      `INSERT INTO invoices (citizen_id, property_id, total, remaining_amount, description) 
       VALUES ($1, $2, $3, $3, $4) RETURNING *`,
      [citizenId, propertyId, total, description]
    );
    return rows[0];
  },

  async updatePayment(id, amountPaid, remainingAmount, status) {
    const { rows } = await pool.query(
      `UPDATE invoices SET amount_paid=$1, remaining_amount=$2, status=$3 WHERE id=$4 RETURNING *`,
      [amountPaid, remainingAmount, status, id]
    );
    return rows[0];
  },
};

module.exports = invoiceRepository;
