import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Srinadh%4018@localhost:5432/speedx_motors'
});

async function syncDemoUsers() {
  const client = await pool.connect();
  try {
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('admin', salt);
    const userHash = await bcrypt.hash('user', salt);

    // 1. Ensure Admin role (id: 1)
    await client.query(`
      INSERT INTO roles (id, name, description)
      VALUES (1, 'ADMIN', 'Dealership Principal & System Administrator')
      ON CONFLICT (id) DO UPDATE SET name = 'ADMIN'
    `);

    // 2. Ensure Customer role (id: 2)
    await client.query(`
      INSERT INTO roles (id, name, description)
      VALUES (2, 'CUSTOMER', 'VIP Hypercar Client')
      ON CONFLICT (id) DO UPDATE SET name = 'CUSTOMER'
    `);

    // 3. Ensure Admin user
    await client.query(`
      INSERT INTO users (name, email, password_hash, role_id, phone, status)
      VALUES ('Dealership Administrator', 'admin@speedxmotors.com', $1, 1, '+1 (800) SPEEDX-ADM', 'ACTIVE')
      ON CONFLICT (email) DO UPDATE SET name = 'Dealership Administrator', password_hash = $1, role_id = 1
    `, [adminHash]);

    // 4. Ensure Customer user
    const userRes = await client.query(`
      INSERT INTO users (name, email, password_hash, role_id, phone, status)
      VALUES ('John Smith', 'user@speedxmotors.com', $1, 2, '+1 (555) 234-5678', 'ACTIVE')
      ON CONFLICT (email) DO UPDATE SET name = 'John Smith', password_hash = $1, role_id = 2
      RETURNING id
    `, [userHash]);

    const customerUserId = userRes.rows[0]?.id;
    if (customerUserId) {
      await client.query(`
        INSERT INTO customers (user_id, membership_tier)
        VALUES ($1, 'Platinum VIP Member')
        ON CONFLICT (user_id) DO UPDATE SET membership_tier = 'Platinum VIP Member'
      `, [customerUserId]);
    }

    console.log('[SYNC] ✅ Demo users (admin@speedxmotors.com / user@speedxmotors.com) synced in PostgreSQL successfully!');
  } catch (err) {
    console.error('[SYNC] ❌ Error syncing users:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

syncDemoUsers();
