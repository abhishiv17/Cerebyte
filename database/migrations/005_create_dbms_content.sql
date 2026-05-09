-- 005_create_dbms_content.sql
CREATE TABLE IF NOT EXISTS public.dbms_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    setup_sql TEXT,
    expected_output_rows INTEGER,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.dbms_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view dbms lessons" ON public.dbms_lessons;
CREATE POLICY "Anyone can view dbms lessons" ON public.dbms_lessons FOR SELECT USING (true);

-- Also include ER Diagrams here as they are part of DBMS module
CREATE TABLE IF NOT EXISTS public.er_diagrams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Diagram',
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.er_diagrams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own diagrams" ON public.er_diagrams;
CREATE POLICY "Users can view their own diagrams" ON public.er_diagrams FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own diagrams" ON public.er_diagrams;
CREATE POLICY "Users can manage their own diagrams" ON public.er_diagrams FOR ALL USING (auth.uid() = user_id);

-- Trigger for er_diagrams
DROP TRIGGER IF EXISTS update_er_diagrams_updated_at ON public.er_diagrams;
CREATE TRIGGER update_er_diagrams_updated_at
BEFORE UPDATE ON public.er_diagrams
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
