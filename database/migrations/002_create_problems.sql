-- 002_create_problems.sql
CREATE TABLE IF NOT EXISTS public.problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
    topic TEXT NOT NULL,
    time_limit_ms INTEGER DEFAULT 2000,
    memory_limit_mb INTEGER DEFAULT 256,
    test_cases JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT '{}'::text[],
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view problems" ON public.problems;
CREATE POLICY "Anyone can view problems" ON public.problems FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins/creators can modify problems" ON public.problems;
CREATE POLICY "Only admins/creators can modify problems" ON public.problems FOR ALL USING (auth.uid() = created_by);

CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_topic ON public.problems(topic);

-- Trigger for problems
DROP TRIGGER IF EXISTS update_problems_updated_at ON public.problems;
CREATE TRIGGER update_problems_updated_at
BEFORE UPDATE ON public.problems
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
