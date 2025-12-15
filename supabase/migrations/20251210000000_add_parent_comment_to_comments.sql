-- Add parent_comment_id column to support threaded replies
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;

-- Create index for better performance when querying replies
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_comment_id);

-- Add comment to explain the column
COMMENT ON COLUMN public.comments.parent_comment_id IS 'NULL for main comments, references parent comment for replies';
