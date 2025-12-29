import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { executeQuery, queryOne } from '@/lib/mysql';

export const dynamic = 'force-dynamic';


// Helper to get Supabase Admin client
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Missing Supabase credentials (URL or Service Role Key)');
    }
    return createClient(url, key);
}

// TEMPORARY: REPAIR MODE
export async function GET() {
    const report = [];
    try {
        console.log('Starting Schema Repair...');

        // 1. Ensure Table Exists
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS services (
                id VARCHAR(36) PRIMARY KEY,
                title_en VARCHAR(255),
                title_fr VARCHAR(255),
                title_ar VARCHAR(255),
                description_en TEXT,
                description_fr TEXT,
                description_ar TEXT,
                icon VARCHAR(50),
                href VARCHAR(255),
                color VARCHAR(50),
                is_active BOOLEAN DEFAULT TRUE,
                display_order INT DEFAULT 0,
                image_url TEXT,
                price DECIMAL(10, 2),
                duration_minutes INT,
                is_bookable BOOLEAN DEFAULT FALSE,
                show_price BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);
        report.push({ step: 'create_table', status: 'Success' });

        // 2. Add Missing Columns One by One
        const columns = [
            'subtitle_en TEXT', 'subtitle_fr TEXT', 'subtitle_ar TEXT',
            'features_en JSON', 'features_fr JSON', 'features_ar JSON'
        ];

        for (const col of columns) {
            try {
                await executeQuery(`ALTER TABLE services ADD COLUMN ${col}`);
                report.push({ column: col, status: 'Added' });
            } catch (e: any) {
                if (e.code === 'ER_DUP_FIELDNAME' || e.message?.includes('Duplicate column')) {
                    report.push({ column: col, status: 'Already Exists' });
                } else {
                    report.push({ column: col, status: 'Error', error: e.message });
                }
            }
        }

        return NextResponse.json({
            mode: 'REPAIR_DIAGNOSTIC',
            success: true,
            report
        });

    } catch (error: any) {
        return NextResponse.json({
            mode: 'REPAIR_DIAGNOSTIC',
            success: false,
            fatal_error: error.message,
            report
        });
    }
}
