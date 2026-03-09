const pool = require("../config/database");

const cahierRepository = {
  async hasPurchased(citizenId, propertyId) {
    try {
      const { rows } = await pool.query(
        "SELECT id FROM cahier_purchases WHERE citizen_id = $1 AND property_id = $2",
        [citizenId, propertyId],
      );
      const result = rows.length > 0;
      console.log(
        `🔍 hasPurchased check: citizen=${citizenId}, property=${propertyId}, result=${result}`,
      );
      return result;
    } catch (err) {
      console.error("Error in hasPurchased:", err);
      throw err;
    }
  },

  async purchase(citizenId, propertyId) {
    try {
      console.log(
        `📝 Recording purchase: citizen=${citizenId}, property=${propertyId}`,
      );
      const { rows } = await pool.query(
        `INSERT INTO cahier_purchases (citizen_id, property_id) VALUES ($1, $2)
         ON CONFLICT (citizen_id, property_id) DO NOTHING
         RETURNING id, citizen_id AS "citizenId", property_id AS "propertyId", purchased_at AS "purchasedAt"`,
        [citizenId, propertyId],
      );
      console.log(`✅ Purchase recorded:`, rows[0]);
      return rows[0];
    } catch (err) {
      console.error("Error in purchase:", err);
      throw err;
    }
  },

  async getPurchasesByProperty(propertyId) {
    const { rows } = await pool.query(
      `SELECT cp.id, cp.citizen_id AS "citizenId", u.username AS "citizenName",
              cp.purchased_at AS "purchasedAt"
       FROM cahier_purchases cp
       JOIN users u ON cp.citizen_id = u.id
       WHERE cp.property_id = $1
       ORDER BY cp.purchased_at DESC`,
      [propertyId],
    );
    return rows;
  },

  async getPurchasesByCitizen(citizenId) {
    const { rows } = await pool.query(
      `SELECT cp.id, cp.property_id AS "propertyId", p.title AS "propertyTitle",
              cp.purchased_at AS "purchasedAt"
       FROM cahier_purchases cp
       JOIN properties p ON cp.property_id = p.id
       WHERE cp.citizen_id = $1
       ORDER BY cp.purchased_at DESC`,
      [citizenId],
    );
    return rows;
  },
};

module.exports = cahierRepository;
