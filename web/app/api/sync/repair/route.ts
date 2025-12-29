import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    const results = [];
    try {
        const columnsToAdd = [
            'subtitle_en TEXT', 'subtitle_fr TEXT', 'subtitle_ar TEXT',
            'features_en JSON', 'features_fr JSON', 'features_ar JSON'
        ];

        for (const colDef of columnsToAdd) {
            const colName = colDef.split(' ')[0];
            try {
                // Try to add the column
                await executeQuery(`ALTER TABLE services ADD COLUMN ${colDef}`);
                results.push({ column: colName, status: 'Added' });
            } catch (error: any) {
                // Check if error is "Duplicate column name" (code 1060)
                // MySQL error code for duplicate column is 1060
                if (error.code === 'ER_DUP_FIELDNAME' || error.errno === 1060 || error.message?.includes('Duplicate column')) {
                    results.push({ column: colName, status: 'Already Exists' });
                } else {
                    results.push({ column: colName, status: 'Error', error: error.message });
                }
            }
        }

        return NextResponse.json({ success: true, report: results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
