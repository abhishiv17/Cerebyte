-- Migration 001: Add is_admin column to users table
-- Run this in Supabase SQL Editor if you already have an existing database

-- Add the column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false NOT NULL;

-- Drop the old policy
DROP POLICY IF EXISTS "Only admins/creators can modify problems" ON public.problems;

-- Create new admin-only policies for problems
DROP POLICY IF EXISTS "Only admins can insert problems" ON public.problems;
DROP POLICY IF EXISTS "Only admins can update problems" ON public.problems;
DROP POLICY IF EXISTS "Only admins can delete problems" ON public.problems;

CREATE POLICY "Only admins can insert problems" ON public.problems FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Only admins can update problems" ON public.problems FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Only admins can delete problems" ON public.problems FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- To make yourself an admin, run:
-- UPDATE public.users SET is_admin = true WHERE email = 'your@email.com';
