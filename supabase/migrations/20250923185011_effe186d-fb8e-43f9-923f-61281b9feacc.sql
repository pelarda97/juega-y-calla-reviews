-- Eliminar columnas innecesarias de la tabla reviews
ALTER TABLE public.reviews 
DROP COLUMN IF EXISTS graficos,
DROP COLUMN IF EXISTS audio, 
DROP COLUMN IF EXISTS conclusion,
DROP COLUMN IF EXISTS pros,
DROP COLUMN IF EXISTS contras;