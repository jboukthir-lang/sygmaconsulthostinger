-- Migration to add user_id to products, projects, expenses tables
-- This ensures all dashboard entities are scoped to users
-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    sku TEXT,
    is_active BOOLEAN DEFAULT true
);
ALTER TABLE products
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    client_id UUID REFERENCES clients(id),
    start_date DATE,
    end_date DATE
);
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
-- EXPENSES
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    category TEXT
);
ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);