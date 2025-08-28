-- Add new columns to reviews table
ALTER TABLE public.reviews 
ADD COLUMN duracion TEXT,
ADD COLUMN valoracion_personal TEXT,
ADD COLUMN imagenes TEXT[];

-- Update existing review with sample data
UPDATE public.reviews 
SET 
  duracion = 'El juego ofrece aproximadamente 15-20 horas de contenido principal, con misiones secundarias que pueden extender la experiencia hasta las 30 horas.',
  valoracion_personal = 'Una experiencia gaming excepcional que combina narrativa envolvente con mecánicas innovadoras. Recomendado para todos los amantes de los videojuegos.',
  imagenes = ARRAY[
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=400&fit=crop'
  ]
WHERE slug = 'cyberpunk-2077-review';