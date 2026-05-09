-- =============================================================
-- Migration 008: Admiral's Engine Room — Profile & Gamification
-- Adds gamification columns, student info, and tutor toggle
-- =============================================================

-- Add new columns to existing public.users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_no TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS college TEXT DEFAULT 'Dr. Ambedkar Institute of Technology';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS year_of_study INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS usn TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS xp BIGINT DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'Ensign';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS tutor_enabled BOOLEAN DEFAULT true;

-- Index for leaderboard queries (sorted by XP descending)
CREATE INDEX IF NOT EXISTS idx_users_xp ON public.users(xp DESC);

-- Update the handle_new_user trigger to set defaults for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, xp, rank, tutor_enabled)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    0,
    'Ensign',
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
