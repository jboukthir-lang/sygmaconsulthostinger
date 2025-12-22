import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '..', '.env.local');
let supabaseUrl, supabaseServiceKey;

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
} catch (error) {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const createTableSQL = `
-- Create posts table for blog/insights functionality
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_fr TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt_en TEXT NOT NULL,
    excerpt_fr TEXT NOT NULL,
    excerpt_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    author_id UUID,
    author_name TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    featured_image TEXT,
    published BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 5,
    seo_title_en TEXT,
    seo_title_fr TEXT,
    seo_title_ar TEXT,
    seo_description_en TEXT,
    seo_description_fr TEXT,
    seo_description_ar TEXT,
    seo_keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for published posts" ON public.posts;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.posts;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.posts;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.posts;

-- Policy: Everyone can read published posts
CREATE POLICY "Enable read access for published posts"
ON public.posts FOR SELECT
TO public
USING (published = true);

-- Policy: Authenticated users can read all posts (for admin)
CREATE POLICY "Enable read access for authenticated users"
ON public.posts FOR SELECT
TO authenticated
USING (true);

-- Policy: Authenticated users can insert posts
CREATE POLICY "Enable insert for authenticated users"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Authenticated users can update posts
CREATE POLICY "Enable update for authenticated users"
ON public.posts FOR UPDATE
TO authenticated
USING (true);

-- Policy: Authenticated users can delete posts
CREATE POLICY "Enable delete for authenticated users"
ON public.posts FOR DELETE
TO authenticated
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function setupPostsTable() {
  console.log('🔧 Setting up posts table...\n');

  try {
    // Execute the SQL using Supabase client (using RPC or direct SQL)
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL }).catch(() => {
      // If RPC doesn't work, we'll need to use a different approach
      console.log('📝 Please run the SQL migration file manually in Supabase dashboard:');
      console.log('   File: web/supabase/migrations/create_posts_table.sql\n');
      return { data: null, error: { message: 'Please run SQL manually' } };
    });

    if (error) {
      console.log('⚠️  Unable to create table automatically.');
      console.log('📋 Please execute the following in Supabase SQL Editor:\n');
      console.log('   Location: Supabase Dashboard > SQL Editor');
      console.log('   File: web/supabase/migrations/create_posts_table.sql\n');
      console.log('Or copy and execute this SQL:\n');
      console.log(createTableSQL);
    } else {
      console.log('✅ Posts table created successfully!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Please manually execute:');
    console.log('   web/supabase/migrations/create_posts_table.sql');
    console.log('   in Supabase Dashboard > SQL Editor');
  }
}

setupPostsTable();
