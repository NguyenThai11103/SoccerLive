import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Parse DATABASE_URL or use individual env vars
const parseConnectionString = (url) => {
  if (!url) return null;

  try {
    // Format: mysql://user:password@host:port/database
    const match = url.match(/mysql:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)/);
    if (match) {
      return {
        host: match[3],
        port: parseInt(match[4]),
        user: match[1],
        password: match[2],
        database: match[5],
      };
    }
  } catch (error) {
    console.error("Error parsing DATABASE_URL:", error);
  }
  return null;
};

const connectionConfig = parseConnectionString(process.env.DATABASE_URL) || {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "soccerlive",
};

// Create connection pool
const pool = mysql.createPool({
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: "+07:00", // Vietnam timezone
  charset: "utf8mb4",
});

// Test connection
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

/**
 * Execute a query with parameters
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
};

/**
 * Execute a query and return first row
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object|null>} First row or null
 */
export const queryOne = async (sql, params = []) => {
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Execute multiple queries in a transaction
 * @param {Function} callback - Async function that receives connection
 * @returns {Promise<any>} Transaction result
 */
export const transaction = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Insert a record and return the inserted ID
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @returns {Promise<number>} Inserted ID
 */
export const insert = async (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => "?").join(", ");

  const sql = `INSERT INTO ${table} (${keys.join(
    ", "
  )}) VALUES (${placeholders})`;
  const [result] = await pool.execute(sql, values);
  return result.insertId;
};

/**
 * Update records
 * @param {string} table - Table name
 * @param {Object} data - Data to update
 * @param {string} where - WHERE clause
 * @param {Array} whereParams - WHERE parameters
 * @returns {Promise<number>} Number of affected rows
 */
export const update = async (table, data, where, whereParams = []) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");

  const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
  const [result] = await pool.execute(sql, [...values, ...whereParams]);
  return result.affectedRows;
};

/**
 * Delete records
 * @param {string} table - Table name
 * @param {string} where - WHERE clause
 * @param {Array} params - WHERE parameters
 * @returns {Promise<number>} Number of affected rows
 */
export const deleteRecord = async (table, where, params = []) => {
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  const [result] = await pool.execute(sql, params);
  return result.affectedRows;
};

export default pool;
