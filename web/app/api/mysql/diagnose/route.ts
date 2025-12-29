import { NextResponse } from 'next/server';
import { queryAll } from '@/lib/mysql';

export async function GET() {
    try {
        // 1. List all tables
        const tables = await queryAll(`SHOW TABLES`);

        // 2. Check services table columns if it exists
        let columns = [];
        const tablesArray = tables as any[];
        const hasServices = tablesArray.some(row => Object.values(row)[0] === 'services');

        if (hasServices) {
            columns = await queryAll(`DESCRIBE services`);
        }

        return NextResponse.json({
            status: 'connected',
            tables: tables,
            servicesTable: {
                exists: hasServices,
                columns: columns
            }
        });
    } catch (error: any) {
        console.error('MySQL Diagnose Error:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
