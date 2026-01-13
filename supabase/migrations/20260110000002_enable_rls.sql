-- ============================================
-- VERIFICAR Y HABILITAR RLS EN TODAS LAS TABLAS
-- Fecha: 10 Enero 2026
-- ============================================

-- Verificar estado actual de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('reviews', 'comments', 'review_likes', 'page_views');

-- Habilitar RLS en todas las tablas (por si acaso)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Forzar RLS incluso para el dueño de la tabla
ALTER TABLE public.reviews FORCE ROW LEVEL SECURITY;
ALTER TABLE public.comments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes FORCE ROW LEVEL SECURITY;
ALTER TABLE public.page_views FORCE ROW LEVEL SECURITY;

-- Verificar políticas activas
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as operation,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('reviews', 'comments', 'review_likes', 'page_views')
ORDER BY tablename, cmd;

-- Mensaje de confirmación
DO $$ 
BEGIN
  RAISE NOTICE '✅ RLS habilitado y forzado en todas las tablas críticas';
  RAISE NOTICE '🔒 Las políticas RLS ahora se aplicarán estrictamente';
END $$;
