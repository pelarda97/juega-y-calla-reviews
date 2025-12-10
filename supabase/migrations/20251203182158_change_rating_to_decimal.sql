-- Change rating column from integer to numeric to support decimal values
ALTER TABLE reviews 
ALTER COLUMN rating TYPE NUMERIC(3,1);

-- Add a check constraint to ensure rating is between 0 and 5
ALTER TABLE reviews 
DROP CONSTRAINT IF EXISTS reviews_rating_check;

ALTER TABLE reviews 
ADD CONSTRAINT reviews_rating_check CHECK (rating >= 0 AND rating <= 5);

-- Update the comment on the column
COMMENT ON COLUMN reviews.rating IS 'Rating from 0.0 to 5.0 (supports decimals)';
