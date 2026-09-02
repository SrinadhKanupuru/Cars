import dotenv from 'dotenv';
import app from './src/app.js';
import pool from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test PostgreSQL Connection
    const client = await pool.connect();
    const dbRes = await client.query('SELECT current_database(), version()');
    client.release();

    console.log('---------------------------------------------------------');
    console.log('🚀 SPEEDX MOTORS BACKEND SERVER');
    console.log('✦ DRIVE THE EXTRAORDINARY');
    console.log('---------------------------------------------------------');
    console.log(`[DATABASE] ✅ Connected to PostgreSQL database: "${dbRes.rows[0].current_database}"`);

    const server = app.listen(PORT, () => {
      console.log(`[SERVER] 🏎️ SPEEDX REST API running on port http://localhost:${PORT}`);
      console.log(`[HEALTH] 🩺 Health check at http://localhost:${PORT}/api/health`);
      console.log('---------------------------------------------------------');
    });

    // Graceful Shutdown
    const shutdown = async (signal) => {
      console.log(`\n[SERVER] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('[SERVER] Closed HTTP server.');
        await pool.end();
        console.log('[DATABASE] PostgreSQL pool closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    console.error('❌ [FATAL] Failed to connect to PostgreSQL database:', err.message);
    process.exit(1);
  }
}

startServer();
