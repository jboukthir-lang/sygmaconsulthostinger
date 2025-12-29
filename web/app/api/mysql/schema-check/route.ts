import { NextResponse } from 'next/server';
import { queryAll } from '@/lib/mysql';

export async function GET() {
    try {
        const columns = await queryAll(`
            SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'u611120010_sygma' 
            AND TABLE_NAME = 'services'
        `);

        return NextResponse.json({ columns });
    } catch (error: any) {
        console.error('MySQL Schema Check Error:', error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
