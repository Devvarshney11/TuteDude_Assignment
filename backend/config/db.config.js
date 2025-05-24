const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Create a connection pool
// Support both connection string and individual parameters
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Always use SSL for cloud databases
        max: 10, // maximum number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
        connectionTimeoutMillis: 10000, // how long to wait when connecting a new client (10 seconds for cloud)
        query_timeout: 30000, // query timeout (30 seconds)
        statement_timeout: 30000, // statement timeout (30 seconds)
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        max: 10, // maximum number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
        connectionTimeoutMillis: 10000, // how long to wait when connecting a new client
        query_timeout: 30000, // query timeout (30 seconds)
        statement_timeout: 30000, // statement timeout (30 seconds)
      }
);

// Test the connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Database connection established successfully");
    client.release();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

testConnection();

module.exports = pool;
