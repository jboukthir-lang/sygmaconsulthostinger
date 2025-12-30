import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const json = await request.json();

        // Remove protected fields from update if any
        const { id: _, created_at, ...updateData } = json;

        const { data, error } = await supabaseAdmin
            .from('companies')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error updating company:', error);
        return NextResponse.json(
            { error: 'Failed to update company', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        const { error } = await supabaseAdmin
            .from('companies')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting company:', error);
        return NextResponse.json(
            { error: 'Failed to delete company', details: error.message },
            { status: 500 }
        );
    }
}
