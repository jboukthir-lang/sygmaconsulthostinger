import { NextResponse } from 'next/server';
import { queryAll, queryOne } from '@/lib/mysql';

// GET /api/mysql/test - Test MySQL connection
export async function GET() {
  // Check if we're in production OR if we have credentials in dev
  const hasCredentials = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD;

  if (process.env.NODE_ENV !== 'production' && !hasCredentials) {
    return NextResponse.json({
      success: false,
      message: 'ℹ️ MySQL is disabled in development mode',
      note: 'To enable in dev, add DB_* variables to your .env file',
      debug: {
        host_configured: !!process.env.DB_HOST,
        user_configured: !!process.env.DB_USER,
        host_value: process.env.DB_HOST || 'undefined (defaulting to localhost)'
      }
    }, { status: 200 });
  }

  // Debug check
  if (!process.env.DB_HOST) {
    return NextResponse.json({
      success: false,
      message: '❌ DB_HOST is missing. The app is trying to connect to localhost.',
      tip: 'Did you restart the server after creating .env?'
    }, { status: 500 });
  }

  try {
    console.log('🔍 Testing MySQL connection...');

    // Test basic query
    const result = await queryOne('SELECT 1 + 1 as result');

    // Get database info
    const dbInfo = await queryOne('SELECT DATABASE() as db_name, VERSION() as version');

    // Count tables
    const tables = await queryAll('SHOW TABLES');

    // Get priorities count
    const prioritiesCount = await queryOne('SELECT COUNT(*) as count FROM priorities');

    // Get tasks count
    const tasksCount = await queryOne('SELECT COUNT(*) as count FROM tasks');

    return NextResponse.json({
      success: true,
      message: '✅ MySQL connection successful',
      data: {
        test_query: result,
        database: dbInfo,
        tables_count: tables.length,
        tables: tables,
        priorities_count: (prioritiesCount as any)?.count || 0,
        tasks_count: (tasksCount as any)?.count || 0
      }
    });
  } catch (error: any) {
    console.error('❌ MySQL connection failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}
