-- =============================================================
-- Migration 007: Onboarding & Narrative Progression
-- The "Admiral Hopper" Adaptive Onboarding System
-- =============================================================

-- Stores user onboarding diagnostic answers + generated quest map
CREATE TABLE IF NOT EXISTS user_onboarding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Diagnostic answers (JSON blob from the discovery phase)
    experience_level TEXT NOT NULL DEFAULT 'beginner',         -- beginner | intermediate | advanced
    primary_language TEXT NOT NULL DEFAULT 'python',           -- python | javascript | cpp | java
    career_goal TEXT NOT NULL DEFAULT 'university',            -- university | faang | competitive | general
    focus_areas TEXT[] DEFAULT ARRAY['dsa']::TEXT[],           -- dsa, dbms, sql, algorithms
    weekly_hours INTEGER DEFAULT 5,                           -- self-reported study hours/week

    -- Narrative state
    naval_rank TEXT NOT NULL DEFAULT 'Ensign',                 -- Ensign → Lieutenant → Commander → Captain → Admiral
    quest_map_narrative TEXT,                                  -- Groq-generated personalized narrative
    story_flags JSONB DEFAULT '{}'::JSONB,                    -- milestone story flags (e.g. {"linked_list_mastered": true})

    -- Completion tracking
    onboarding_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_user_onboarding UNIQUE (user_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON user_onboarding(user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_onboarding_updated_at ON user_onboarding;
CREATE TRIGGER trigger_update_onboarding_updated_at
    BEFORE UPDATE ON user_onboarding
    FOR EACH ROW
    EXECUTE FUNCTION update_onboarding_updated_at();

-- RLS Policies
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Users can view own onboarding" ON user_onboarding;
DROP POLICY IF EXISTS "Users can insert own onboarding" ON user_onboarding;
DROP POLICY IF EXISTS "Users can update own onboarding" ON user_onboarding;
DROP POLICY IF EXISTS "Service role full access to onboarding" ON user_onboarding;

-- Users can only read/write their own onboarding data
CREATE POLICY "Users can view own onboarding"
    ON user_onboarding FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding"
    ON user_onboarding FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding"
    ON user_onboarding FOR UPDATE
    USING (auth.uid() = user_id);

-- Service role bypass for backend operations
CREATE POLICY "Service role full access to onboarding"
    ON user_onboarding FOR ALL
    USING (auth.role() = 'service_role');
