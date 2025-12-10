-- Add genre column to reviews table for filtering
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS genre TEXT;

-- Update existing reviews with genres (if any exist)
-- You can update them later when you migrate the content
