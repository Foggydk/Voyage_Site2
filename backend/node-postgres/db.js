const { Pool } = require('pg');

function poolConfig() {
  if (process.env.PGPASSWORD || process.env.PGUSER) {
    return {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT || 5432),
      database: process.env.PGDATABASE || 'postgres',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
    };
  }
  return { connectionString: process.env.DATABASE_URL };
}

const pool = new Pool(poolConfig());

module.exports = { pool, query: (text, params) => pool.query(text, params) };
