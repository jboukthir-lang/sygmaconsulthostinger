import mysql from 'mysql2/promise';

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
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

export default pool;

// Helper function to execute queries
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T> {
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
  try {
    const [results] = await pool.execute(query, params);
    return results as T[];
  } catch (error) {
    console.error('MySQL Query Error:', error);
    throw error;
  }
}
