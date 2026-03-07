const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
  process.exit(-1);
});

// Test connection
async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully");
    console.log("Server time:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

testConnection();

module.exports = pool;
