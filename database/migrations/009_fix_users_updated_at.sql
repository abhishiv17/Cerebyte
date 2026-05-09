-- Fix: Add missing updated_at column to users table
-- The trigger update_users_updated_at expects this column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

