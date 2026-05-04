-- 004_create_dsa_content.sql
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

ALTER TABLE public.dsa_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view dsa lessons" ON public.dsa_lessons;
CREATE POLICY "Anyone can view dsa lessons" ON public.dsa_lessons FOR SELECT USING (true);
