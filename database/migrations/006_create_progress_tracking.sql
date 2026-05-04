-- 006_create_progress_tracking.sql

-- Table to track completed lessons (DSA/DBMS)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL, 
    lesson_type TEXT CHECK (lesson_type IN ('dsa', 'dbms')) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id, lesson_type)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can record their own progress" ON public.user_progress;
CREATE POLICY "Users can record their own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

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
