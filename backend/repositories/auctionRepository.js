const pool = require('../config/database');

const auctionRepository = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT a.id, a.property_id AS "propertyId", p.title AS "propertyTitle",
       a.start_date AS "startDate", a.end_date AS "endDate", a.status,
       a.starting_price AS "startingPrice", a.final_price AS "finalPrice", 
       COALESCE((SELECT MAX(amount) FROM bids WHERE auction_id = a.id), a.starting_price) AS "currentPrice",
       p.image_url AS "propertyImage",
       a.created_at AS "createdAt"
       FROM auctions a JOIN properties p ON a.property_id = p.id ORDER BY a.created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM auctions WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create({ propertyId, startDate, endDate, startingPrice }) {
    const { rows } = await pool.query(
      `INSERT INTO auctions (property_id, start_date, end_date, starting_price) VALUES ($1,$2,$3,$4) RETURNING *`,
      [propertyId, startDate, endDate, startingPrice]
    );
    return rows[0];
  },

  async close(id, finalPrice) {
    const { rows } = await pool.query(
      `UPDATE auctions SET status='CLOSED', final_price=$1 WHERE id=$2 RETURNING *`,
      [finalPrice, id]
    );
    return rows[0];
  },

  async getBids(auctionId) {
    const { rows } = await pool.query(
      `SELECT b.id, b.amount, b.date, u.username AS "citizenName"
       FROM bids b JOIN users u ON b.citizen_id = u.id
       WHERE b.auction_id = $1 ORDER BY b.amount DESC`, [auctionId]
    );
    return rows;
  },

  async getHighestBid(auctionId) {
    const { rows } = await pool.query(
      'SELECT MAX(amount) AS max FROM bids WHERE auction_id = $1', [auctionId]
    );
    return rows[0]?.max || 0;
  },

  async placeBid({ auctionId, citizenId, amount }) {
    const { rows } = await pool.query(
      'INSERT INTO bids (auction_id, citizen_id, amount) VALUES ($1,$2,$3) RETURNING *',
      [auctionId, citizenId, amount]
    );
    return rows[0];
  },

  async getWinner(auctionId) {
    const { rows } = await pool.query(
      `SELECT citizen_id FROM bids WHERE auction_id = $1 ORDER BY amount DESC LIMIT 1`,
      [auctionId]
    );
    return rows[0]?.citizen_id || null;
  },
};

module.exports = auctionRepository;
