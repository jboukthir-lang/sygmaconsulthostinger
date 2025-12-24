import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Test Supabase connection by querying a simple table
        const { data, error, count } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true });

        if (error) {
            return NextResponse.json({
                status: 'error',
                message: 'Supabase query failed',
                error: error.message,
                code: error.code
            }, { status: 500 });
        }

        // Check other tables
        const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('id', { count: 'exact', head: true });

        const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select('id', { count: 'exact', head: true });

        return NextResponse.json({
            status: 'success',
            message: 'Supabase connection successful',
            tables: {
                users: !error,
                bookings: !bookingsError,
                posts: !postsError
            },
            counts: {
                users: count || 0
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Supabase connection failed',
            error: error.message
        }, { status: 500 });
    }
}
