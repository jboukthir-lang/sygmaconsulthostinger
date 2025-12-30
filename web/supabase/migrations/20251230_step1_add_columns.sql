-- Step 1: Add user_id columns ONLY
-- Run this script FIRST.
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS user_id TEXT;