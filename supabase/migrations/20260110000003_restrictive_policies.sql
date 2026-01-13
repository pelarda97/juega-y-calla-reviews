-- ============================================
-- SOLUCIÓN DEFINITIVA: POLÍTICAS RESTRICTIVE
-- Fecha: 10 Enero 2026
-- Las políticas RESTRICTIVE se aplican con AND (todas deben cumplirse)
-- Las políticas PERMISSIVE se aplican con OR (solo una debe cumplirse)
-- ============================================

-- ============================================
-- REVIEWS: Políticas RESTRICTIVE
-- ============================================

-- Eliminar todas las políticas actuales
DROP POLICY IF EXISTS "Reviews SELECT public" ON public.reviews;
DROP POLICY IF EXISTS "Reviews INSERT blocked" ON public.reviews;
DROP POLICY IF EXISTS "Reviews UPDATE blocked" ON public.reviews;
DROP POLICY IF EXISTS "Reviews DELETE blocked" ON public.reviews;

-- SELECT: Permitir lectura (PERMISSIVE)
CREATE POLICY "Reviews can be read"
ON public.reviews
FOR SELECT
USING (true);

-- INSERT/UPDATE/DELETE: Bloquear con RESTRICTIVE (ninguna condición se cumple)
CREATE POLICY "Reviews INSERT restricted"
ON public.reviews
AS RESTRICTIVE
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Reviews UPDATE restricted"
ON public.reviews
AS RESTRICTIVE
FOR UPDATE
USING (false);

CREATE POLICY "Reviews DELETE restricted"
ON public.reviews
AS RESTRICTIVE
FOR DELETE
USING (false);


-- ============================================
-- COMMENTS: Políticas RESTRICTIVE
-- ============================================

DROP POLICY IF EXISTS "Comments SELECT public" ON public.comments;
DROP POLICY IF EXISTS "Comments INSERT validated" ON public.comments;
DROP POLICY IF EXISTS "Comments UPDATE blocked" ON public.comments;
DROP POLICY IF EXISTS "Comments DELETE blocked" ON public.comments;

CREATE POLICY "Comments can be read"
ON public.comments
FOR SELECT
USING (true);

CREATE POLICY "Comments INSERT allowed"
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

CREATE POLICY "Comments UPDATE restricted"
ON public.comments
AS RESTRICTIVE
FOR UPDATE
USING (false);

CREATE POLICY "Comments DELETE restricted"
ON public.comments
AS RESTRICTIVE
FOR DELETE
USING (false);


-- ============================================
-- REVIEW_LIKES: Políticas RESTRICTIVE
-- ============================================

DROP POLICY IF EXISTS "Likes SELECT public" ON public.review_likes;
DROP POLICY IF EXISTS "Likes INSERT once" ON public.review_likes;
DROP POLICY IF EXISTS "Likes UPDATE blocked" ON public.review_likes;
DROP POLICY IF EXISTS "Likes DELETE blocked" ON public.review_likes;

CREATE POLICY "Likes can be read"
ON public.review_likes
FOR SELECT
USING (true);

CREATE POLICY "Likes INSERT allowed"
ON public.review_likes
FOR INSERT
WITH CHECK (
  review_id IS NOT NULL AND
  user_session IS NOT NULL AND
  (is_like = true OR is_like = false)
);

CREATE POLICY "Likes UPDATE restricted"
ON public.review_likes
AS RESTRICTIVE
FOR UPDATE
USING (false);

CREATE POLICY "Likes DELETE restricted"
ON public.review_likes
AS RESTRICTIVE
FOR DELETE
USING (false);


-- ============================================
-- PAGE_VIEWS: Políticas RESTRICTIVE
-- ============================================

DROP POLICY IF EXISTS "Views SELECT public" ON public.page_views;
DROP POLICY IF EXISTS "Views INSERT validated" ON public.page_views;
DROP POLICY IF EXISTS "Views UPDATE blocked" ON public.page_views;
DROP POLICY IF EXISTS "Views DELETE blocked" ON public.page_views;

CREATE POLICY "Views can be read"
ON public.page_views
FOR SELECT
USING (true);

CREATE POLICY "Views INSERT allowed"
ON public.page_views
FOR INSERT
WITH CHECK (
  page_type IS NOT NULL AND
  length(trim(page_type)) > 0
);

CREATE POLICY "Views UPDATE restricted"
ON public.page_views
AS RESTRICTIVE
FOR UPDATE
USING (false);

CREATE POLICY "Views DELETE restricted"
ON public.page_views
AS RESTRICTIVE
FOR DELETE
USING (false);


-- Mensaje de confirmación
DO $$ 
BEGIN
  RAISE NOTICE '✅ Políticas RESTRICTIVE aplicadas correctamente';
  RAISE NOTICE '🔒 UPDATE/DELETE ahora bloqueados incluso sin filas afectadas';
  RAISE NOTICE '📊 Las políticas RESTRICTIVE usan lógica AND (más seguras)';
END $$;
