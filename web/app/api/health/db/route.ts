import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        // Check if pool exists
        if (!pool) {
            return NextResponse.json({
                status: 'error',
                message: 'Database not configured',
                details: 'Missing environment variables: DB_HOST, DB_USER, DB_PASSWORD, or DB_NAME',
                env_check: {
                    DB_HOST: !!process.env.DB_HOST,
                    DB_USER: !!process.env.DB_USER,
                    DB_PASSWORD: !!process.env.DB_PASSWORD,
                    DB_NAME: !!process.env.DB_NAME
                }
            }, { status: 500 });
        }

        // Try to execute a simple query
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT 1 as test');
        connection.release();

        // Check if bookings table exists
        const [tables] = await pool.execute(
            "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'bookings'",
            [process.env.DB_NAME]
        );

        return NextResponse.json({
            status: 'success',
            message: 'Database connection successful',
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            bookings_table_exists: tables && (tables as any[]).length > 0,
            test_query: rows
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
            code: error.code,
            env_check: {
                DB_HOST: !!process.env.DB_HOST,
                DB_USER: !!process.env.DB_USER,
                DB_PASSWORD: !!process.env.DB_PASSWORD,
                DB_NAME: !!process.env.DB_NAME
            }
        }, { status: 500 });
    }
}
