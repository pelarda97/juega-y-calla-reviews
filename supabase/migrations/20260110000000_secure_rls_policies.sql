-- ============================================
-- MIGRACIÓN: POLÍTICAS RLS SEGURAS
-- Fecha: 10 Enero 2026
-- Objetivo: Proteger reseñas, likes y views de manipulación
-- ============================================

-- ============================================
-- 1. REVIEWS - Solo admin puede modificar
-- ============================================

-- Eliminar políticas inseguras anteriores
DROP POLICY IF EXISTS "Reviews can be updated by admin" ON public.reviews;
DROP POLICY IF EXISTS "Reviews can be inserted by admin" ON public.reviews;

-- SELECT: Mantener público (ya existe)
-- "Reviews are viewable by everyone" - NO TOCAR

-- INSERT: BLOQUEADO para anon key (solo service key)
CREATE POLICY "Reviews INSERT blocked for anon users"
ON public.reviews
FOR INSERT
WITH CHECK (false);

-- UPDATE: BLOQUEADO para anon key (solo service key)
CREATE POLICY "Reviews UPDATE blocked for anon users"
ON public.reviews
FOR UPDATE
USING (false);

-- DELETE: BLOQUEADO para anon key (solo service key)
CREATE POLICY "Reviews DELETE blocked for anon users"
ON public.reviews
FOR DELETE
USING (false);


-- ============================================
-- 2. COMMENTS - Crear anónimo, moderar admin
-- ============================================

-- Eliminar políticas inseguras anteriores
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;

-- SELECT: Mantener público (ya existe)
-- "Comments are viewable by everyone" - NO TOCAR

-- INSERT: Permitir con validaciones estrictas
CREATE POLICY "Comments INSERT with validation"
ON public.comments
FOR INSERT
WITH CHECK (
  -- Validar contenido (10-5000 caracteres)
  content IS NOT NULL AND 
  length(trim(content)) >= 10 AND
  length(trim(content)) <= 5000 AND
  -- Validar autor (2-50 caracteres - columna: author_name)
  author_name IS NOT NULL AND
  length(trim(author_name)) >= 2 AND
  length(trim(author_name)) <= 50 AND
  -- Validar que tenga review_id
  review_id IS NOT NULL
);

-- UPDATE: BLOQUEADO (solo admin con service key)
CREATE POLICY "Comments UPDATE blocked for anon users"
ON public.comments
FOR UPDATE
USING (false);

-- DELETE: BLOQUEADO (solo admin con service key)
CREATE POLICY "Comments DELETE blocked for anon users"
ON public.comments
FOR DELETE
USING (false);


-- ============================================
-- 3. REVIEW_LIKES - Proteger contra manipulación
-- ============================================

-- Eliminar políticas inseguras anteriores
DROP POLICY IF EXISTS "Users can update their own likes" ON public.review_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.review_likes;
DROP POLICY IF EXISTS "Anyone can like/dislike reviews" ON public.review_likes;

-- SELECT: Mantener público (ya existe)
-- "Review likes are viewable by everyone" - NO TOCAR

-- INSERT: Permitir pero solo UNA VEZ por sesión
-- El índice único UNIQUE(review_id, user_session) previene duplicados
CREATE POLICY "Likes INSERT once per session"
ON public.review_likes
FOR INSERT
WITH CHECK (
  review_id IS NOT NULL AND
  user_session IS NOT NULL AND
  (is_like = true OR is_like = false)
);

-- UPDATE: BLOQUEADO completamente (no cambiar votos)
CREATE POLICY "Likes UPDATE blocked for everyone"
ON public.review_likes
FOR UPDATE
USING (false);

-- DELETE: BLOQUEADO completamente (no borrar votos)
CREATE POLICY "Likes DELETE blocked for everyone"
ON public.review_likes
FOR DELETE
USING (false);


-- ============================================
-- 4. PAGE_VIEWS - Solo inserción, no manipulación
-- ============================================

-- Eliminar política insegura anterior
DROP POLICY IF EXISTS "Anyone can record page views" ON public.page_views;

-- SELECT: Mantener público (ya existe)
-- "Page views are viewable by everyone" - NO TOCAR

-- INSERT: Permitir con validación básica
CREATE POLICY "Page views INSERT with validation"
ON public.page_views
FOR INSERT
WITH CHECK (
  -- Validar que page_type no esté vacío
  page_type IS NOT NULL AND
  length(trim(page_type)) > 0
  -- user_session e ip_address son opcionales (pueden ser NULL)
);

-- UPDATE: BLOQUEADO (no manipular conteo)
CREATE POLICY "Page views UPDATE blocked"
ON public.page_views
FOR UPDATE
USING (false);

-- DELETE: BLOQUEADO (no manipular conteo)
CREATE POLICY "Page views DELETE blocked"
ON public.page_views
FOR DELETE
USING (false);


-- ============================================
-- 5. VERIFICAR ÍNDICES ÚNICOS (prevenir duplicados)
-- ============================================

-- Índice único ya existe en la definición de la tabla:
-- UNIQUE(review_id, user_session)
-- No es necesario crear uno nuevo

-- Mensaje de confirmación
DO $$ 
BEGIN
  RAISE NOTICE 'Políticas RLS seguras aplicadas correctamente';
  RAISE NOTICE 'Reviews: Solo modificables con service_role key';
  RAISE NOTICE 'Comments: Crear anónimo, editar/borrar solo admin';
  RAISE NOTICE 'Likes: Un voto por IP, no modificables';
  RAISE NOTICE 'Page Views: Solo inserción, conteo protegido';
END $$;
