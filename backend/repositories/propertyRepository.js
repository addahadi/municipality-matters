const pool = require('../config/database');

const propertyRepository = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT id, title, cahier_de_charge_pdf AS "cahierDeChargePDF", cahier_price AS "cahierPrice",
       superficie, status, location, starting_auction_price AS "startingAuctionPrice",
       rental_contract_pdf AS "rentalContractPDF", image_url AS "imageUrl", 
       tenant_id AS "tenantId", registration_fees_paid AS "registrationFeesPaid", guarantees_paid AS "guaranteesPaid", created_at AS "createdAt"
       FROM properties ORDER BY created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, title, cahier_de_charge_pdf AS "cahierDeChargePDF", cahier_price AS "cahierPrice",
       superficie, status, location, starting_auction_price AS "startingAuctionPrice",
       rental_contract_pdf AS "rentalContractPDF", image_url AS "imageUrl",
       tenant_id AS "tenantId", registration_fees_paid AS "registrationFeesPaid", guarantees_paid AS "guaranteesPaid", created_at AS "createdAt"
       FROM properties WHERE id = $1`, [id]
    );
    return rows[0] || null;
  },

  async create({ title, superficie, status, location, startingAuctionPrice, cahierPrice, cahierDeChargePDF, rentalContractPDF, imageUrl, tenantId, registrationFeesPaid, guaranteesPaid }) {
    const { rows } = await pool.query(
      `INSERT INTO properties (title, superficie, status, location, starting_auction_price, cahier_price, cahier_de_charge_pdf, rental_contract_pdf, image_url, tenant_id, registration_fees_paid, guarantees_paid)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [title, superficie, status || 'AVAILABLE', location, startingAuctionPrice, cahierPrice, cahierDeChargePDF, rentalContractPDF, imageUrl, tenantId, registrationFeesPaid || false, guaranteesPaid || false]
    );
    return rows[0];
  },

  async update(id, fields) {
    const { title, superficie, status, location, startingAuctionPrice, cahierPrice, cahierDeChargePDF, rentalContractPDF, imageUrl, tenantId, registrationFeesPaid, guaranteesPaid } = fields;
    const { rows } = await pool.query(
      `UPDATE properties SET title=COALESCE($1,title), superficie=COALESCE($2,superficie), status=COALESCE($3,status),
       location=COALESCE($4,location), starting_auction_price=COALESCE($5,starting_auction_price),
       cahier_price=COALESCE($6,cahier_price), cahier_de_charge_pdf=COALESCE($7,cahier_de_charge_pdf),
       rental_contract_pdf=COALESCE($8,rental_contract_pdf), image_url=COALESCE($9,image_url),
       tenant_id=COALESCE($10,tenant_id), registration_fees_paid=COALESCE($11,registration_fees_paid),
       guarantees_paid=COALESCE($12,guarantees_paid) WHERE id=$13 RETURNING *`,
      [title, superficie, status, location, startingAuctionPrice, cahierPrice, cahierDeChargePDF, rentalContractPDF, imageUrl, tenantId, registrationFeesPaid, guaranteesPaid, id]
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
       tenant_id AS "tenantId", registration_fees_paid AS "registrationFeesPaid", guarantees_paid AS "guaranteesPaid", created_at AS "createdAt"
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
