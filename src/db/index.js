const { Pool } = require("pg");
const { env } = require("../config/env");

const shouldUseSsl =
  env.NODE_ENV === "production" || env.DATABASE_URL.includes("sslmode=require");

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
};
