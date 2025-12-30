import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            owner_id,
            name,
            siret,
            tva_number,
            legal_form,
            address,
            city,
            zip_code,
            country,
            phone,
            subscription_plan,
            email
        } = body;

        if (!owner_id || !name) {
            return NextResponse.json(
                { error: 'Owner ID and Company Name are required' },
                { status: 400 }
            );
        }

        // Insert company using Admin Client (bypassing RLS)
        const { data, error } = await supabaseAdmin
            .from('companies')
            .insert([
                {
                    owner_id,
                    name,
                    siret,
                    tva_number,
                    legal_form,
                    address,
                    city,
                    zip_code,
                    country,
                    phone,
                    subscription_plan,
                    subscription_status: 'active', // Default to active for now
                    email
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
