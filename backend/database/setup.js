import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Srinadh%4018@localhost:5432/speedx_motors',
});

async function runSetup() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seed.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  const seedSql = fs.readFileSync(seedPath, 'utf-8');

  console.log('[DB SETUP] Initializing SPEEDX MOTORS PostgreSQL Database...');
  const client = await pool.connect();
  try {
    console.log('[DB SETUP] 1. Applying Schema...');
    await client.query(schemaSql);
    console.log('[DB SETUP] ✅ Schema applied.');

    console.log('[DB SETUP] 2. Applying Seed Data...');
    await client.query(seedSql);
    console.log('[DB SETUP] ✅ Seed data populated.');

    console.log('[DB SETUP] 🚀 Database setup completed successfully!');
  } catch (err) {
    console.error('[DB SETUP] ❌ Setup failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runSetup();
