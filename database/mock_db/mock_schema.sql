-- 🧠 Cerebyte Supabase Schema

-- Users Table (Extending Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Problems Table (DSA Problems)
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_topic ON public.problems(topic);

-- Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    status TEXT NOT NULL, -- e.g., 'pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error'
    execution_time_ms NUMERIC,
    memory_used_mb NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON public.submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

-- DSA Lessons Table
CREATE TABLE IF NOT EXISTS public.dsa_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    big_o_time TEXT,
    big_o_space TEXT,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DBMS Lessons Table
CREATE TABLE IF NOT EXISTS public.dbms_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    setup_sql TEXT,
    expected_output_rows INTEGER,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ER Diagrams Table
CREATE TABLE IF NOT EXISTS public.er_diagrams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Diagram',
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL,
    lesson_type TEXT CHECK (lesson_type IN ('dsa', 'dbms')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id, lesson_type)
);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dbms_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.er_diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view problems" ON public.problems;
CREATE POLICY "Anyone can view problems" ON public.problems FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins/creators can modify problems" ON public.problems;
CREATE POLICY "Only admins/creators can modify problems" ON public.problems FOR ALL USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can view their own submissions" ON public.submissions;
CREATE POLICY "Users can view their own submissions" ON public.submissions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.submissions;
CREATE POLICY "Users can insert their own submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view dsa lessons" ON public.dsa_lessons;
CREATE POLICY "Anyone can view dsa lessons" ON public.dsa_lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view dbms lessons" ON public.dbms_lessons;
CREATE POLICY "Anyone can view dbms lessons" ON public.dbms_lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view their own diagrams" ON public.er_diagrams;
CREATE POLICY "Users can view their own diagrams" ON public.er_diagrams FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own diagrams" ON public.er_diagrams;
CREATE POLICY "Users can manage their own diagrams" ON public.er_diagrams FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert/update their own progress" ON public.user_progress;
CREATE POLICY "Users can insert/update their own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- Create a trigger to automatically add new signups to the public.users table
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger Function to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_problems_updated_at ON public.problems;
CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON public.problems
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_er_diagrams_updated_at ON public.er_diagrams;
CREATE TRIGGER update_er_diagrams_updated_at
  BEFORE UPDATE ON public.er_diagrams
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Helper View for the Dashboard Stats
-- This aggregates solved problems and completed lessons for each user
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.email,
    (SELECT COUNT(DISTINCT s.problem_id) FROM public.submissions s WHERE s.user_id = u.id AND s.status = 'accepted') as problems_solved,
    (SELECT COUNT(*) FROM public.user_progress p WHERE p.user_id = u.id) as lessons_completed,
    (SELECT COUNT(*) FROM public.er_diagrams d WHERE d.user_id = u.id) as diagrams_created
FROM public.users u;
