import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch company details for the user (owner)
        const { data, error } = await supabaseAdmin
            .from('companies')
            .select('*')
            .eq('owner_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.warn('Error fetching company settings:', error);
            // Fallback: Check if user has a company_name in user_profiles to pre-fill?
            // For now, return empty object to allow form to be blank.
            return NextResponse.json({});
        }

        if (!data) {
            return NextResponse.json({});
        }

        // Map DB columns to frontend expected fields
        return NextResponse.json({
            name: data.name,
            legal_form: data.legal_form,
            siret: data.siret,
            tva_number: data.tva_number,
            address: data.address,
            city: data.city,
            postal_code: data.zip_code, // Map zip_code to postal_code
            country: data.country || 'France',
            email: data.email,
            phone: data.phone,
            website: data.website // Might be undefined if column missing, handled by frontend
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Check if company exists for this user
        const { data: existingCompany } = await supabaseAdmin
            .from('companies')
            .select('id')
            .eq('owner_id', userId)
            .single();

        const companyData = {
            owner_id: userId,
            name: body.name,
            legal_form: body.legal_form,
            siret: body.siret,
            tva_number: body.tva_number,
            address: body.address,
            city: body.city,
            zip_code: body.postal_code, // Map postal_code to zip_code
            country: body.country,
            email: body.email,
            phone: body.phone,
            // website: body.website // Omit if column surely doesn't exist, but let's try or skip.
            // If column doesn't exist, Supabase will ignore or error depending on exact setup? 
            // It often errors on unknown column. 
            // Given the migration files don't show 'website', let's check if we should add it?
            // Safer to omitted it for now to avoid 500 error if column is missing.
            updated_at: new Date().toISOString()
        };

        let result;
        if (existingCompany) {
            // Update
            result = await supabaseAdmin
                .from('companies')
                .update(companyData)
                .eq('id', existingCompany.id)
                .select()
                .single();
        } else {
            // Insert
            result = await supabaseAdmin
                .from('companies')
                .insert([companyData])
                .select()
                .single();
        }

        if (result.error) throw result.error;

        return NextResponse.json(result.data);
    } catch (error: any) {
        console.error('Settings Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
