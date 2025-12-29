'use server'

import { createClient } from '@supabase/supabase-js';

export async function saveSiteSettings(settings: any) {
    console.log('[Server Action] Saving site settings...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let isServiceRole = true;

    if (!supabaseKey) {
        console.warn('[Server Action] Missing SUPABASE_SERVICE_ROLE_KEY. Falling back to ANON key.');
        supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        isServiceRole = false;
    }

    if (!supabaseUrl || !supabaseKey) {
        return {
            success: false,
            error: 'CRITICAL: Missing Database Configuration. Cannot save.'
        };
    }

    // Initialize client
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    });

    try {
        // 1. Try Update
        const { error: updateError, count } = await supabaseClient
            .from('app_config')
            .update(settings)
            .eq('key', 'main')
            .select('*', { count: 'exact' });

        if (updateError) {
            console.error('[Server Action] Update failed:', updateError);

            if (!isServiceRole && updateError.code === '42501') {
                return {
                    success: false,
                    error: 'Permission Denied. Please run the "Option A" SQL script to allow updates.'
                };
            }

            return { success: false, error: 'Update Failed: ' + updateError.message };
        }

        // 2. If no row updated, Insert
        if (count === 0) {
            console.log('[Server Action] No row found, inserting...');
            const { error: insertError } = await supabaseClient
                .from('app_config')
                .insert({ ...settings, key: 'main' });

            if (insertError) {
                console.error('[Server Action] Insert failed:', insertError);
                return { success: false, error: 'Insert Failed: ' + insertError.message };
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error('[Server Action] Exception:', error);
        return { success: false, error: 'Server Exception: ' + error.message };
    }
}
