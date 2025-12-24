import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Load .env.production.local if it exists and we're in production
if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  try {
    const envPath = path.join(process.cwd(), '.env.production.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            if (!process.env[key.trim()]) {
              process.env[key.trim()] = value.trim();
            }
          }
        }
      });
      console.log('✅ DB: Loaded .env.production.local');
    } else {
      console.log('⚠️ DB: .env.production.local not found at:', envPath);
    }
  } catch (error) {
    console.error('❌ DB: Error loading .env.production.local:', error);
  }
}

// Database configuration from environment variables with production fallback
const dbConfig = {
  host: process.env.DB_HOST || (process.env.NODE_ENV === 'production' ? 'srv1790.hstgr.io' : 'localhost'),
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || (process.env.NODE_ENV === 'production' ? 'u611120010_sygma' : undefined),
  password: process.env.DB_PASSWORD || (process.env.NODE_ENV === 'production' ? 'GZK446uj%' : undefined),
  database: process.env.DB_NAME || (process.env.NODE_ENV === 'production' ? 'u611120010_sygma' : undefined),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Log config in production for debugging
if (process.env.NODE_ENV === 'production') {
  console.log('DB Config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user ? '***SET***' : 'NOT SET',
    password: dbConfig.password ? '***SET***' : 'NOT SET',
    database: dbConfig.database
  });
}

// Check if database credentials are configured (check the actual dbConfig, not env vars)
const isDbConfigured = !!(dbConfig.user && dbConfig.password && dbConfig.database);

// Create a connection pool only if DB is configured
let pool: mysql.Pool | null = null;

if (isDbConfigured) {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ Database pool created successfully');
  } catch (error) {
    console.error('Failed to create database pool:', error);
  }
} else {
  console.error('❌ Database not configured. Missing credentials.');
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
