import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase Client (Service Role)
 * ⚠️ Use ONLY on server-side for admin operations
 * This client bypasses Row Level Security (RLS)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ldbsacdpkinbpcguvgai.supabase.co';

// Try to get service role key from env, fallback to hardcoded (works for dev and prod now)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5NTA3OCwiZXhwIjoyMDgxNDcxMDc4fQ.6n-kSxKBq_e4_NtYPRfyPDFHwjNhMiPmEP-GRbnhk4E';

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
