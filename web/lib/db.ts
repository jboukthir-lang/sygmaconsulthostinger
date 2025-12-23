import mysql from 'mysql2/promise';

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Check if database credentials are configured
const isDbConfigured = !!(process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME);

// Create a connection pool only if DB is configured
let pool: mysql.Pool | null = null;

if (isDbConfigured) {
  try {
    pool = mysql.createPool(dbConfig);
  } catch (error) {
    console.error('Failed to create database pool:', error);
  }
}

// Helper function to execute queries with type safety
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  if (!pool) {
    console.warn('Database not configured. Skipping query:', sql);
    throw new Error('Database connection not configured. Please set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in your environment variables.');
  }

  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;
