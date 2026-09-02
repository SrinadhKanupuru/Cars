import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Srinadh%4018@localhost:5432/speedx_motors',
});

async function verify() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('✅ Created Tables in speedx_motors:');
    console.table(res.rows);

    const carCount = await client.query('SELECT count(*) FROM cars;');
    const userCount = await client.query('SELECT count(*) FROM users;');
    const testDriveCount = await client.query('SELECT count(*) FROM test_drives;');
    const leadCount = await client.query('SELECT count(*) FROM leads;');

    console.log(`📊 Total Seeded Records:`);
    console.log(`- Cars: ${carCount.rows[0].count}`);
    console.log(`- Users/Staff: ${userCount.rows[0].count}`);
    console.log(`- Test Drives: ${testDriveCount.rows[0].count}`);
    console.log(`- Leads: ${leadCount.rows[0].count}`);
  } catch (err) {
    console.error('Error verifying database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

verify();
