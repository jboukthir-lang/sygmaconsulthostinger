import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const startTime = Date.now();

        // Test Supabase connection by querying users table
        const { error: usersError, count: usersCount } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true });

        const duration = Date.now() - startTime;

        if (usersError) {
            return NextResponse.json({
                status: 'error',
                provider: 'Supabase',
                message: 'Supabase connection failed',
                error: usersError.message,
                code: usersError.code,
                latency: `${duration}ms`
            }, { status: 500 });
        }

        // Check other core tables
        const tables = ['bookings', 'posts', 'services', 'contacts'];
        const tableChecks: Record<string, boolean> = {};

        for (const table of tables) {
            const { error } = await supabase.from(table).select('id', { head: true, count: 'exact' });
            tableChecks[table] = !error;
        }

        return NextResponse.json({
            status: 'success',
            provider: 'Supabase',
            message: 'Database connection verified',
            endpoint: 'ldbsacdpkinbpcguvgai.supabase.co',
            latency: `${duration}ms`,
            summary: {
                users_count: usersCount || 0,
                connected_tables: Object.entries(tableChecks).filter(([_, v]) => v).map(([k]) => k)
            },
            verified_tables: tableChecks
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            provider: 'Supabase',
            message: 'An unexpected error occurred during health check',
            error: error.message
        }, { status: 500 });
    }
}
