-- =========================================================
-- XUI Platform Database Schema (Supabase PostgreSQL)
-- =========================================================

-- 1. Components Stats Table (Views & Likes)
CREATE TABLE IF NOT EXISTS public.components_stats (
    id TEXT PRIMARY KEY,                       -- Component slug / id (e.g., 'dynamic-floating-dock')
    views BIGINT NOT NULL DEFAULT 0,
    likes BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.components_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
CREATE POLICY "Allow public read access to components stats"
    ON public.components_stats
    FOR SELECT
    USING (true);

-- 2. Stored Function: Atomically Increment Views
CREATE OR REPLACE FUNCTION public.increment_component_views(component_id TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_views BIGINT;
BEGIN
    INSERT INTO public.components_stats (id, views, likes, updated_at)
    VALUES (component_id, 1, 0, NOW())
    ON CONFLICT (id)
    DO UPDATE SET 
        views = public.components_stats.views + 1,
        updated_at = NOW()
    RETURNING views INTO new_views;

    RETURN new_views;
END;
$$;

-- 3. Stored Function: Toggle or Increment/Decrement Likes
CREATE OR REPLACE FUNCTION public.toggle_component_like(component_id TEXT, is_like BOOLEAN)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_likes BIGINT;
BEGIN
    INSERT INTO public.components_stats (id, views, likes, updated_at)
    VALUES (component_id, 0, CASE WHEN is_like THEN 1 ELSE 0 END, NOW())
    ON CONFLICT (id)
    DO UPDATE SET 
        likes = GREATEST(0, public.components_stats.likes + CASE WHEN is_like THEN 1 ELSE -1 END),
        updated_at = NOW()
    RETURNING likes INTO new_likes;

    RETURN new_likes;
END;
$$;

-- Grant execution permissions to anonymous & authenticated users
GRANT EXECUTE ON FUNCTION public.increment_component_views(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_component_like(TEXT, BOOLEAN) TO anon, authenticated;

-- Initial Seed for existing components
INSERT INTO public.components_stats (id, views, likes)
VALUES ('dynamic-floating-dock', 28000, 1830)
ON CONFLICT (id) DO NOTHING;
