const pool = require('../config/database');

const propertyRepository = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT id, title, cahier_de_charge_pdf AS "cahierDeChargePDF", cahier_price AS "cahierPrice",
       superficie, status, location, starting_auction_price AS "startingAuctionPrice",
       rental_contract_pdf AS "rentalContractPDF", image_url AS "imageUrl", 
       tenant_id AS "tenantId", created_at AS "createdAt"
       FROM properties ORDER BY created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, title, cahier_de_charge_pdf AS "cahierDeChargePDF", cahier_price AS "cahierPrice",
       superficie, status, location, starting_auction_price AS "startingAuctionPrice",
       rental_contract_pdf AS "rentalContractPDF", image_url AS "imageUrl",
       tenant_id AS "tenantId", created_at AS "createdAt"
       FROM properties WHERE id = $1`, [id]
    );
    return rows[0] || null;
  },

  async create({ title, superficie, status, location, startingAuctionPrice, cahierPrice, cahierDeChargePDF, rentalContractPDF, imageUrl, tenantId }) {
    const { rows } = await pool.query(
      `INSERT INTO properties (title, superficie, status, location, starting_auction_price, cahier_price, cahier_de_charge_pdf, rental_contract_pdf, image_url, tenant_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title, superficie, status || 'AVAILABLE', location, startingAuctionPrice, cahierPrice, cahierDeChargePDF, rentalContractPDF, imageUrl, tenantId]
    );
    return rows[0];
  },

  async update(id, fields) {
    const { title, superficie, status, location, startingAuctionPrice, cahierPrice, cahierDeChargePDF, rentalContractPDF, imageUrl, tenantId } = fields;
    const { rows } = await pool.query(
      `UPDATE properties SET title=COALESCE($1,title), superficie=COALESCE($2,superficie), status=COALESCE($3,status),
       location=COALESCE($4,location), starting_auction_price=COALESCE($5,starting_auction_price),
       cahier_price=COALESCE($6,cahier_price), cahier_de_charge_pdf=COALESCE($7,cahier_de_charge_pdf),
       rental_contract_pdf=COALESCE($8,rental_contract_pdf), image_url=COALESCE($9,image_url),
       tenant_id=COALESCE($10,tenant_id) WHERE id=$11 RETURNING *`,
      [title, superficie, status, location, startingAuctionPrice, cahierPrice, cahierDeChargePDF, rentalContractPDF, imageUrl, tenantId, id]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM properties WHERE id = $1', [id]);
  },

  async findByTenant(tenantId) {
    const { rows } = await pool.query(
      `SELECT id, title, cahier_de_charge_pdf AS "cahierDeChargePDF", cahier_price AS "cahierPrice",
       superficie, status, location, starting_auction_price AS "startingAuctionPrice",
       rental_contract_pdf AS "rentalContractPDF", image_url AS "imageUrl", 
       tenant_id AS "tenantId", created_at AS "createdAt"
       FROM properties WHERE tenant_id = $1 ORDER BY created_at DESC`, [tenantId]
    );
    return rows;
  },

  async getStats() {
    const { rows } = await pool.query(
      `SELECT status, COUNT(*)::int AS count FROM properties GROUP BY status`
    );
    return rows;
  },
};

module.exports = propertyRepository;
