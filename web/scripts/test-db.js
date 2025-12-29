const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Manually load .env.production
try {
    const envPath = path.resolve(__dirname, '../.env.production');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
            process.env[key] = value;
        }
    });
} catch (e) {
    console.error('Could not read .env.production:', e.message);
}

async function testConnection() {
    console.log('Testing MySQL Connection...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('DB:', process.env.DB_NAME);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '3306'),
            ssl: { rejectUnauthorized: false },
            connectTimeout: 10000
        });

        console.log('✅ Connected successfully!');
        const [rows] = await connection.execute('SHOW TABLES');
        console.log('Tables found:', rows.map(r => Object.values(r)[0]));

        // Check services table
        if (rows.some(r => Object.values(r)[0] === 'services')) {
            console.log('✅ Services table exists.');
            const [cols] = await connection.execute('DESCRIBE services');
            console.log('Services columns:', cols.map(c => c.Field));
        } else {
            console.log('❌ Services table MISSING.');
        }

        await connection.end();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Code:', error.code);
    }
}

testConnection();
