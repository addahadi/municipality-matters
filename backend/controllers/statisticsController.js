const pool = require("../config/database");

const statisticsController = {
  // Admin: full system stats
  async getAdminStats(req, res) {
    try {
      const [props, users, invoices, auctions, requests, complaints] =
        await Promise.all([
          pool.query(
            `SELECT status, COUNT(*)::int AS count FROM properties GROUP BY status`,
          ),
          pool.query(
            `SELECT role, COUNT(*)::int AS count FROM users GROUP BY role`,
          ),
          pool.query(
            `SELECT status, COUNT(*)::int AS count, COALESCE(SUM(total),0)::float AS "totalAmount", COALESCE(SUM(amount_paid),0)::float AS "totalPaid" FROM invoices GROUP BY status`,
          ),
          pool.query(
            `SELECT status, COUNT(*)::int AS count FROM auctions GROUP BY status`,
          ),
          pool.query(
            `SELECT status, COUNT(*)::int AS count FROM requests GROUP BY status`,
          ),
          pool.query(
            `SELECT status, COUNT(*)::int AS count FROM complaints GROUP BY status`,
          ),
        ]);

      const totalProperties = props.rows.reduce((s, r) => s + r.count, 0);
      const totalUsers = users.rows.reduce((s, r) => s + r.count, 0);
      const totalCitizens =
        users.rows.find((r) => r.role === "CITIZEN")?.count || 0;
      const totalInvoices = invoices.rows.reduce((s, r) => s + r.count, 0);
      const totalAuctions = auctions.rows.reduce((s, r) => s + r.count, 0);
      const activeAuctions =
        auctions.rows.find((r) => r.status === "OPEN")?.count || 0;
      const pendingRequests =
        requests.rows.find((r) => r.status === "PENDING")?.count || 0;
      const pendingComplaints =
        complaints.rows.find((r) => r.status === "PENDING")?.count || 0;

      res.json({
        totalProperties,
        totalUsers,
        totalCitizens,
        totalInvoices,
        totalAuctions,
        activeAuctions,
        pendingRequests,
        pendingComplaints,
        propertyByStatus: props.rows.map((r) => ({
          name: r.status,
          value: r.count,
        })),
        usersByRole: users.rows.map((r) => ({ name: r.role, value: r.count })),
        invoicesByStatus: invoices.rows,
        auctionsByStatus: auctions.rows,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Employee: operational stats
  async getEmployeeStats(req, res) {
    try {
      const [props, auctions, requests, complaints] = await Promise.all([
        pool.query(`SELECT COUNT(*)::int AS count FROM properties`),
        pool.query(
          `SELECT status, COUNT(*)::int AS count FROM auctions GROUP BY status`,
        ),
        pool.query(
          `SELECT status, COUNT(*)::int AS count FROM requests GROUP BY status`,
        ),
        pool.query(
          `SELECT status, COUNT(*)::int AS count FROM complaints GROUP BY status`,
        ),
      ]);

      const activeAuctions =
        auctions.rows.find((r) => r.status === "OPEN")?.count || 0;
      const pendingRequests =
        requests.rows.find((r) => r.status === "PENDING")?.count || 0;
      const pendingComplaints =
        complaints.rows.find((r) => r.status === "PENDING")?.count || 0;

      res.json({
        totalProperties: props.rows[0]?.count || 0,
        activeAuctions,
        pendingRequests,
        pendingComplaints,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Citizen: personal stats
  async getCitizenStats(req, res) {
    try {
      const userId = req.user.id;
      const [invoices, requests, complaints, announcements] = await Promise.all(
        [
          pool.query(
            `SELECT COUNT(*)::int AS count FROM invoices WHERE citizen_id = $1`,
            [userId],
          ),
          pool.query(
            `SELECT COUNT(*)::int AS count FROM requests WHERE citizen_id = $1`,
            [userId],
          ),
          pool.query(
            `SELECT COUNT(*)::int AS count FROM complaints WHERE citizen_id = $1`,
            [userId],
          ),
          pool.query(`SELECT COUNT(*)::int AS count FROM announcements`),
        ],
      );

      // Properties count = all available properties (citizens can browse)
      const props = await pool.query(
        `SELECT COUNT(*)::int AS count FROM properties`,
      );

      res.json({
        totalProperties: props.rows[0]?.count || 0,
        totalInvoices: invoices.rows[0]?.count || 0,
        totalRequests: requests.rows[0]?.count || 0,
        totalAnnouncements: announcements.rows[0]?.count || 0,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Recent activity for admin
  async getRecentActivity(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;

      // Fetch recent activities from multiple tables
      const [properties, auctions, requests, invoices, complaints] =
        await Promise.all([
          pool.query(
            `
          SELECT 'PROPERTY' as type, id, 'property' as resource_type, 
                 COALESCE(title, 'New Property') as title, created_at, 'CREATED' as action
          FROM properties 
          ORDER BY created_at DESC 
          LIMIT $1
        `,
            [limit],
          ),
          pool.query(
            `
          SELECT 'AUCTION' as type, a.id, 'auction' as resource_type,
                 COALESCE(p.title, 'Auction') as title, a.created_at, 'CREATED' as action
          FROM auctions a
          LEFT JOIN properties p ON a.property_id = p.id
          ORDER BY a.created_at DESC 
          LIMIT $1
        `,
            [limit],
          ),
          pool.query(
            `
          SELECT 'REQUEST' as type, id, 'request' as resource_type,
                 COALESCE(type, 'New Request') as title, date as created_at, status as action
          FROM requests 
          ORDER BY date DESC 
          LIMIT $1
        `,
            [limit],
          ),
          pool.query(
            `
          SELECT 'INVOICE' as type, i.id, 'invoice' as resource_type,
                 COALESCE(u.username, 'Invoice') as title, i.created_at, i.status as action
          FROM invoices i
          LEFT JOIN users u ON i.citizen_id = u.id
          ORDER BY i.created_at DESC 
          LIMIT $1
        `,
            [limit],
          ),
          pool.query(
            `
          SELECT 'COMPLAINT' as type, id, 'complaint' as resource_type,
                 COALESCE('Complaint #' || id, 'New Complaint') as title, date as created_at, status as action
          FROM complaints 
          ORDER BY date DESC 
          LIMIT $1
        `,
            [limit],
          ),
        ]);

      // Merge and sort by date
      const activities = [
        ...properties.rows,
        ...auctions.rows,
        ...requests.rows,
        ...invoices.rows,
        ...complaints.rows,
      ]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);

      res.json(activities);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = statisticsController;
