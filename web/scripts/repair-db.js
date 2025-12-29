require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function repairDatabase() {
    console.log('🔧 Starting Database Repair...\n');

    const config = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    };

    console.log(`📍 Connecting to: ${config.host}`);
    console.log(`👤 User: ${config.user}`);
    console.log(`🗄️  Database: ${config.database}\n`);

    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('✅ Connected to MySQL\n');

        // Add missing columns
        const columns = [
            { name: 'subtitle_en', type: 'TEXT' },
            { name: 'subtitle_fr', type: 'TEXT' },
            { name: 'subtitle_ar', type: 'TEXT' },
            { name: 'features_en', type: 'JSON' },
            { name: 'features_fr', type: 'JSON' },
            { name: 'features_ar', type: 'JSON' }
        ];

        console.log('🔍 Checking and adding missing columns...\n');

        for (const col of columns) {
            try {
                await connection.execute(
                    `ALTER TABLE services ADD COLUMN ${col.name} ${col.type}`
                );
                console.log(`✅ Added column: ${col.name}`);
            } catch (error) {
                if (error.code === 'ER_DUP_FIELDNAME' || error.errno === 1060) {
                    console.log(`ℹ️  Column already exists: ${col.name}`);
                } else {
                    console.error(`❌ Error adding ${col.name}:`, error.message);
                }
            }
        }

        console.log('\n✅ Database repair completed!');
        console.log('\n🎯 Next steps:');
        console.log('1. The database schema is now fixed');
        console.log('2. Your website should work now (refresh it)');
        console.log('3. You can run the sync tool to populate data');

    } catch (error) {
        console.error('\n❌ Fatal Error:', error.message);
        console.error('\n💡 Troubleshooting:');
        console.error('- Check your .env.local file has correct DB credentials');
        console.error('- Verify MySQL allows remote connections from your IP');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Disconnected from MySQL');
        }
    }
}

repairDatabase();
