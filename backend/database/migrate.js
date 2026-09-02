import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Srinadh%4018@localhost:5432/speedx_motors',
});

async function runMigration() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  console.log('[MIGRATION] Running schema migration on SPEEDX MOTORS PostgreSQL database...');
  const client = await pool.connect();
  try {
    await client.query(schemaSql);
    console.log('[MIGRATION] ✅ Schema created successfully with all tables and indexes.');
  } catch (err) {
    console.error('[MIGRATION] ❌ Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
