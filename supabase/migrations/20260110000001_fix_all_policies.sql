-- ============================================
-- CORRECCIÓN COMPLETA: ELIMINAR TODAS LAS POLÍTICAS Y RECREAR
-- Fecha: 10 Enero 2026
-- Objetivo: Eliminar políticas conflictivas y aplicar protección total
-- ============================================

-- ============================================
-- REVIEWS: Eliminar TODAS las políticas existentes
-- ============================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'reviews' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.reviews';
    END LOOP;
END $$;

-- Recrear políticas seguras para REVIEWS
CREATE POLICY "Reviews SELECT public"
ON public.reviews
FOR SELECT
USING (true);  -- Lectura pública permitida

CREATE POLICY "Reviews INSERT blocked"
ON public.reviews
FOR INSERT
WITH CHECK (false);  -- Solo service_role key

CREATE POLICY "Reviews UPDATE blocked"
ON public.reviews
FOR UPDATE
USING (false);  -- Solo service_role key

CREATE POLICY "Reviews DELETE blocked"
ON public.reviews
FOR DELETE
USING (false);  -- Solo service_role key


-- ============================================
-- COMMENTS: Eliminar TODAS las políticas existentes
-- ============================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'comments' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.comments';
    END LOOP;
END $$;

-- Recrear políticas seguras para COMMENTS
CREATE POLICY "Comments SELECT public"
ON public.comments
FOR SELECT
USING (true);  -- Lectura pública permitida

CREATE POLICY "Comments INSERT validated"
ON public.comments
FOR INSERT
WITH CHECK (
  content IS NOT NULL AND 
  length(trim(content)) >= 10 AND
  length(trim(content)) <= 5000 AND
  author_name IS NOT NULL AND
  length(trim(author_name)) >= 2 AND
  length(trim(author_name)) <= 50 AND
  review_id IS NOT NULL
);

CREATE POLICY "Comments UPDATE blocked"
ON public.comments
FOR UPDATE
USING (false);  -- Solo service_role key (moderación)

CREATE POLICY "Comments DELETE blocked"
ON public.comments
FOR DELETE
USING (false);  -- Solo service_role key (moderación)


-- ============================================
-- REVIEW_LIKES: Eliminar TODAS las políticas existentes
-- ============================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'review_likes' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.review_likes';
    END LOOP;
END $$;

-- Recrear políticas seguras para REVIEW_LIKES
CREATE POLICY "Likes SELECT public"
ON public.review_likes
FOR SELECT
USING (true);  -- Lectura pública permitida

CREATE POLICY "Likes INSERT once"
ON public.review_likes
FOR INSERT
WITH CHECK (
  review_id IS NOT NULL AND
  user_session IS NOT NULL AND
  (is_like = true OR is_like = false)
);

CREATE POLICY "Likes UPDATE blocked"
ON public.review_likes
FOR UPDATE
USING (false);  -- Nadie puede modificar votos

CREATE POLICY "Likes DELETE blocked"
ON public.review_likes
FOR DELETE
USING (false);  -- Nadie puede eliminar votos


-- ============================================
-- PAGE_VIEWS: Eliminar TODAS las políticas existentes
-- ============================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'page_views' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.page_views';
    END LOOP;
END $$;

-- Recrear políticas seguras para PAGE_VIEWS
CREATE POLICY "Views SELECT public"
ON public.page_views
FOR SELECT
USING (true);  -- Lectura pública permitida

CREATE POLICY "Views INSERT validated"
ON public.page_views
FOR INSERT
WITH CHECK (
  page_type IS NOT NULL AND
  length(trim(page_type)) > 0
);

CREATE POLICY "Views UPDATE blocked"
ON public.page_views
FOR UPDATE
USING (false);  -- Solo service_role key

CREATE POLICY "Views DELETE blocked"
ON public.page_views
FOR DELETE
USING (false);  -- Solo service_role key


-- Mensaje de confirmación
DO $$ 
BEGIN
  RAISE NOTICE '✅ Todas las políticas RLS han sido recreadas correctamente';
  RAISE NOTICE '🔒 Reviews: Solo service_role key puede INSERT/UPDATE/DELETE';
  RAISE NOTICE '💬 Comments: INSERT validado, UPDATE/DELETE solo service_role key';
  RAISE NOTICE '👍 Likes: INSERT único, UPDATE/DELETE bloqueados para todos';
  RAISE NOTICE '📊 Views: INSERT validado, UPDATE/DELETE solo service_role key';
END $$;
