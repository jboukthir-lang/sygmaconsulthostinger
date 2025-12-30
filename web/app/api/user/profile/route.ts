import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Fetch profile from user_profiles table
        let { data: profile, error } = await supabaseAdmin
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code === 'PGRST116') {
            // Profile doesn't exist, create default
            const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

            if (userError || !user) throw new Error('User not found');

            const { data: newProfile, error: createError } = await supabaseAdmin
                .from('user_profiles')
                .insert([{
                    id: userId,
                    full_name: user.user.user_metadata?.full_name || '',
                    email: user.user.email,
                    role: 'owner'
                }])
                .select()
                .single();

            if (createError) throw createError;
            profile = newProfile;
        } else if (error) {
            throw error;
        }

        return NextResponse.json(profile);
    } catch (error: any) {
        console.error('Profile Fetch Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { full_name, phone, address, city, photo_url } = body;

        const { data, error } = await supabaseAdmin
            .from('user_profiles')
            .update({
                full_name,
                phone,
                address,
                city,
                photo_url,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
