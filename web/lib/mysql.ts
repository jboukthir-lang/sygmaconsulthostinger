import mysql from 'mysql2/promise';

// Only create MySQL connection pool in production
const isProduction = process.env.NODE_ENV === 'production';

let pool: mysql.Pool | null = null;

// Only create MySQL connection pool if credentials are provided
// Modified to support Dev mode if variables are present
const hasCredentials = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD;

if (hasCredentials) {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // Add SSL for remote Hostinger connection (required often)
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Test connection
  pool.getConnection()
    .then(connection => {
      console.log('✅ MySQL connected successfully');
      connection.release();
    })
    .catch(err => {
      console.error('❌ MySQL connection failed:', err.message);
    });
} else {
  console.log('ℹ️ MySQL disabled: Missing DB_* environment variables');
}

export default pool;

// Helper function to execute queries
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T> {
  if (!pool) {
    throw new Error('MySQL is not available in development mode');
  }
  try {
    const [results] = await pool.execute(query, params);
    return results as T;
  } catch (error) {
    console.error('MySQL Query Error:', error);
    throw error;
  }
}

// Helper function to get a single row
export async function queryOne<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  if (!pool) {
    throw new Error('MySQL is not available in development mode');
  }
  try {
    const [results] = await pool.execute(query, params);
    const rows = results as any[];
    return rows.length > 0 ? (rows[0] as T) : null;
  } catch (error) {
    console.error('MySQL Query Error:', error);
    throw error;
  }
}

// Helper function to get all rows
export async function queryAll<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  if (!pool) {
    throw new Error('MySQL is not available in development mode');
  }
  try {
    const [results] = await pool.execute(query, params);
    return results as T[];
  } catch (error) {
    console.error('MySQL Query Error:', error);
    throw error;
  }
}
