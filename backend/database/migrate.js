/**
 * Database Migration Runner - Sprint 26
 * Runs SQL migration files in order, tracks applied migrations.
 * Usage: node database/migrate.js
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes('ISI_CONNECTION')) {
    console.error('❌ DATABASE_URL not configured. Set it in .env before running migrations.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Bootstrap: create migrations tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ schema_migrations table ready');

    // Get already-applied migrations
    const { rows: applied } = await pool.query('SELECT filename FROM schema_migrations');
    const appliedSet = new Set(applied.map(r => r.filename));

    // Read migration files sorted
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    let newCount = 0;
    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`  skip ${file} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`  ✓ applied ${file}`);
        newCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migration ${file} failed: ${err.message}`);
      } finally {
        client.release();
      }
    }

    console.log(`\n✅ Done. ${newCount} migration(s) applied, ${appliedSet.size} already up to date.`);
  } finally {
    await pool.end();
  }
}

migrate().catch(err => {
  console.error('❌ Migration error:', err.message);
  process.exit(1);
});
