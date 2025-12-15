-- Migration: Add content validation for comments
-- Description: Adds server-side validation to detect offensive content in comments
-- Created: 2025-12-10

-- Function to validate comment content (server-side validation)
CREATE OR REPLACE FUNCTION validate_comment_content()
RETURNS TRIGGER AS $$
DECLARE
  forbidden_words TEXT[] := ARRAY[
    -- Groserías comunes
    'puta', 'puto', 'zorra', 'cabron', 'cabrón', 'coño', 'joder', 'mierda', 'cagar', 'verga',
    'pendejo', 'pendeja', 'chingar', 'pinche', 'culero', 'culera', 'mamón', 'mamona',
    'idiota', 'imbécil', 'estúpido', 'estúpida', 'retrasado', 'retrasada', 'mogólico', 'mogólica',
    
    -- Términos racistas
    'negro de mierda', 'sudaca', 'moro', 'panchito', 'chino de mierda', 'gitano', 'gitana',
    
    -- Términos homófobos
    'maricón', 'maricon', 'marica', 'gay de mierda', 'bollera', 'tortillera', 'travelo',
    'sidoso', 'sidosa', 'trolo', 'puto marica',
    
    -- Términos misóginos
    'feminazi', 'guarra', 'perra', 'furcia', 'ramera', 'golfa',
    
    -- Amenazas
    'te mato', 'te voy a matar', 'ojalá te mueras', 'ojalá mueras', 'suicídate', 'muérete',
    'violación', 'violar', 'te voy a violar',
    
    -- Groserías en inglés
    'fuck', 'shit', 'bitch', 'asshole', 'nigger', 'faggot', 'cunt', 'dick', 'pussy',
    'motherfucker', 'retard', 'retarded'
  ];
  word TEXT;
  content_lower TEXT;
BEGIN
  -- Validate content is not empty
  IF NEW.content IS NULL OR TRIM(NEW.content) = '' THEN
    RAISE EXCEPTION 'El comentario no puede estar vacío';
  END IF;

  -- Validate content length
  IF LENGTH(NEW.content) < 3 THEN
    RAISE EXCEPTION 'El comentario debe tener al menos 3 caracteres';
  END IF;

  IF LENGTH(NEW.content) > 1000 THEN
    RAISE EXCEPTION 'El comentario no puede superar los 1000 caracteres';
  END IF;

  -- Validate author name
  IF NEW.author_name IS NULL OR TRIM(NEW.author_name) = '' THEN
    RAISE EXCEPTION 'El nombre del autor no puede estar vacío';
  END IF;

  IF LENGTH(NEW.author_name) < 2 OR LENGTH(NEW.author_name) > 50 THEN
    RAISE EXCEPTION 'El nombre del autor debe tener entre 2 y 50 caracteres';
  END IF;

  -- Check for forbidden words
  content_lower := LOWER(NEW.content);
  FOREACH word IN ARRAY forbidden_words
  LOOP
    IF content_lower LIKE '%' || word || '%' THEN
      RAISE EXCEPTION 'El comentario contiene lenguaje inapropiado. Por favor, mantén un tono respetuoso.';
    END IF;
  END LOOP;

  -- Check author name for forbidden words
  content_lower := LOWER(NEW.author_name);
  FOREACH word IN ARRAY forbidden_words
  LOOP
    IF content_lower LIKE '%' || word || '%' THEN
      RAISE EXCEPTION 'El nombre contiene lenguaje inapropiado. Por favor, usa un nombre apropiado.';
    END IF;
  END LOOP;

  -- Detect excessive repeated characters (spam)
  IF NEW.content ~ '(.)\1{9,}' THEN
    RAISE EXCEPTION 'Por favor, evita repetir caracteres excesivamente';
  END IF;

  -- Sanitize content: trim and normalize whitespace
  NEW.content := REGEXP_REPLACE(TRIM(NEW.content), '\s+', ' ', 'g');
  NEW.content := REGEXP_REPLACE(NEW.content, '\n{3,}', E'\n\n', 'g');
  
  -- Sanitize author name
  NEW.author_name := TRIM(NEW.author_name);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
DROP TRIGGER IF EXISTS validate_comment_content_insert ON comments;
CREATE TRIGGER validate_comment_content_insert
  BEFORE INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION validate_comment_content();

-- Create trigger for UPDATE operations
DROP TRIGGER IF EXISTS validate_comment_content_update ON comments;
CREATE TRIGGER validate_comment_content_update
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION validate_comment_content();

-- Add comment
COMMENT ON FUNCTION validate_comment_content() IS 
'Validates comment content and author name to prevent offensive language, spam, and inappropriate content. Automatically sanitizes content before insertion.';
