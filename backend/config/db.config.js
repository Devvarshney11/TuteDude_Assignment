const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection established successfully");
    connection.release();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

testConnection();

module.exports = pool;
