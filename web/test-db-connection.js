// ====================================
// Database Connection Test Script
// ====================================
// Upload this file to Hostinger and run: node test-db-connection.js

const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  port: 3306,
  user: 'u611120010_sygma',
  password: 'GZK446uj%',
  database: 'u611120010_sygma'
};

async function testConnection() {
  console.log('🔍 Testing MySQL Connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Database: ${config.database}`);
  console.log(`  Password: ${config.password ? '***' + config.password.slice(-2) : 'NOT SET'}\n`);

  try {
    console.log('📡 Attempting to connect...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!\n');

    // Test query
    console.log('🔍 Running test query: SELECT 1 as test');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query result:', rows);
    console.log('');

    // Check tables
    console.log('📋 Checking existing tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('✅ Tables found:', tables.length);
    if (tables.length > 0) {
      console.log('Tables list:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`  ${index + 1}. ${tableName}`);
      });
    } else {
      console.log('⚠️  No tables found in database!');
    }
    console.log('');

    // Check MySQL version
    const [version] = await connection.execute('SELECT VERSION() as version');
    console.log('ℹ️  MySQL Version:', version[0].version);
    console.log('');

    await connection.end();
    console.log('✅ Connection closed successfully');
    console.log('\n🎉 ALL TESTS PASSED! Database is ready to use.');

  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Error Details:', error.sqlMessage || 'No SQL details');
    console.log('\n🔧 Troubleshooting:');

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('  ❌ Access Denied - Check username and password');
      console.log('  → Go to Hostinger → Databases → MySQL');
      console.log('  → Verify user: u611120010_sygma');
      console.log('  → Reset password if needed');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('  ❌ Connection Refused - MySQL service may be down');
      console.log('  → Contact Hostinger support');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('  ❌ Database does not exist');
      console.log('  → Create database: u611120010_sygma');
    } else {
      console.log('  → Unexpected error, check logs above');
    }

    process.exit(1);
  }
}

testConnection();
