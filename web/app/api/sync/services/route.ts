import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { executeQuery, queryOne } from '@/lib/mysql';

// Create a Supabase client with Service Role for admin access
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        console.log('Starting Sync: Supabase -> MySQL (Services)');

        // 1. Fetch from Supabase
        const { data: services, error } = await supabaseAdmin
            .from('services')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw new Error(`Supabase Fetch Error: ${error.message}`);
        if (!services || services.length === 0) return NextResponse.json({ message: 'No services found in Supabase.' });

        // 2. Ensure MySQL Table Exists
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS services (
                id VARCHAR(36) PRIMARY KEY,
                title_en VARCHAR(255),
                title_fr VARCHAR(255),
                title_ar VARCHAR(255),
                description_en TEXT,
                description_fr TEXT,
                description_ar TEXT,
                subtitle_en TEXT,
                subtitle_fr TEXT,
                subtitle_ar TEXT,
                features_en JSON,
                features_fr JSON,
                features_ar JSON,
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

        // 3. Insert/Update Data
        let synchronizedCount = 0;
        for (const service of services) {
            // Arrays need to be JSON stringified for MySQL JSON columns
            const featuresEn = JSON.stringify(service.features_en || []);
            const featuresFr = JSON.stringify(service.features_fr || []);
            const featuresAr = JSON.stringify(service.features_ar || []);

            await executeQuery(`
                INSERT INTO services (
                    id, title_en, title_fr, title_ar,
                    description_en, description_fr, description_ar,
                    subtitle_en, subtitle_fr, subtitle_ar,
                    features_en, features_fr, features_ar,
                    icon, href, color, is_active, display_order,
                    image_url, price, duration_minutes, is_bookable, show_price
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    title_en = VALUES(title_en),
                    title_fr = VALUES(title_fr),
                    title_ar = VALUES(title_ar),
                    description_en = VALUES(description_en),
                    description_fr = VALUES(description_fr),
                    description_ar = VALUES(description_ar),
                    subtitle_en = VALUES(subtitle_en),
                    subtitle_fr = VALUES(subtitle_fr),
                    subtitle_ar = VALUES(subtitle_ar),
                    features_en = VALUES(features_en),
                    features_fr = VALUES(features_fr),
                    features_ar = VALUES(features_ar),
                    icon = VALUES(icon),
                    href = VALUES(href),
                    color = VALUES(color),
                    is_active = VALUES(is_active),
                    display_order = VALUES(display_order),
                    image_url = VALUES(image_url),
                    price = VALUES(price),
                    duration_minutes = VALUES(duration_minutes),
                    is_bookable = VALUES(is_bookable),
                    show_price = VALUES(show_price)
            `, [
                service.id,
                service.title_en, service.title_fr, service.title_ar,
                service.description_en, service.description_fr, service.description_ar,
                service.subtitle_en || '', service.subtitle_fr || '', service.subtitle_ar || '',
                featuresEn, featuresFr, featuresAr,
                service.icon, service.href, service.color,
                service.is_active ? 1 : 0, service.display_order,
                service.image_url, service.price, service.duration_minutes, service.is_bookable ? 1 : 0,
                service.show_price === false ? 0 : 1 // Default true
            ]);
            synchronizedCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Successfully synchronized ${synchronizedCount} services to MySQL.`,
            count: synchronizedCount
        });

    } catch (error: any) {
        console.error('Sync Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
