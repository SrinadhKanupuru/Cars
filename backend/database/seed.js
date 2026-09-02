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

async function runSeed() {
  const seedPath = path.join(__dirname, 'seed.sql');
  const seedSql = fs.readFileSync(seedPath, 'utf-8');

  console.log('[SEED] Seeding SPEEDX MOTORS PostgreSQL database with luxury hypercars and transactions...');
  const client = await pool.connect();
  try {
    await client.query(seedSql);
    console.log('[SEED] ✅ Database seeded successfully with demo cars, users, leads, orders, and services.');
  } catch (err) {
    console.error('[SEED] ❌ Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
