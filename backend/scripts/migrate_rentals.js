const pool = require('../config/database');

async function migrate() {
  try {
    console.log('Adding registration_fees_paid to properties table...');
    await pool.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS registration_fees_paid BOOLEAN DEFAULT false;');
    
    console.log('Adding guarantees_paid to properties table...');
    await pool.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS guarantees_paid BOOLEAN DEFAULT false;');
    
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
