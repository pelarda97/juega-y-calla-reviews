-- Update the rating system to use 0-5 scale with half points
-- Update existing review rating to be in the new scale
UPDATE public.reviews 
SET rating = 4.5 
WHERE slug = 'cyberpunk-2077-review';