-- Migration: Add server-side comment rate limiting
-- Description: Adds indices and optional functions for tracking comment limits on the server
-- Created: 2025-12-10
-- Note: This is optional - client-side enforcement via localStorage is primary

-- Add index on created_at for efficient time-based queries
CREATE INDEX IF NOT EXISTS idx_comments_created_at 
ON comments(created_at DESC);

-- Add index on review_id + created_at for per-review queries
CREATE INDEX IF NOT EXISTS idx_comments_review_created 
ON comments(review_id, created_at DESC);

-- Add index on parent_comment_id for efficient reply queries
CREATE INDEX IF NOT EXISTS idx_comments_parent 
ON comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;

-- Optional: Function to check daily comment limit for a specific session/IP
-- This requires adding a session_id or ip_address column to comments table
-- For now, this is a template that can be expanded if needed

CREATE OR REPLACE FUNCTION check_daily_comment_limit(
  p_review_id UUID,
  p_session_id TEXT,
  p_daily_limit INT DEFAULT 10
) RETURNS BOOLEAN AS $$
DECLARE
  comment_count INT;
BEGIN
  -- Count comments from this session in the last 24 hours
  -- Note: This requires adding session_id column to comments table
  -- For now, returns true to allow comment (client-side handles this)
  
  -- Example implementation if session_id column exists:
  -- SELECT COUNT(*) INTO comment_count
  -- FROM comments
  -- WHERE review_id = p_review_id
  --   AND session_id = p_session_id
  --   AND created_at > NOW() - INTERVAL '24 hours';
  --
  -- RETURN comment_count < p_daily_limit;
  
  -- Current implementation: always allow (client-side enforcement)
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Function to get comment statistics per user/session
CREATE OR REPLACE FUNCTION get_comment_stats(
  p_review_id UUID,
  p_session_id TEXT
) RETURNS TABLE(
  total_comments BIGINT,
  comments_today BIGINT,
  main_comments BIGINT,
  replies BIGINT,
  last_comment_time TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- This is a template for future server-side tracking
  -- Currently returns default values (client-side handles tracking)
  
  RETURN QUERY
  SELECT 
    0::BIGINT AS total_comments,
    0::BIGINT AS comments_today,
    0::BIGINT AS main_comments,
    0::BIGINT AS replies,
    NULL::TIMESTAMP WITH TIME ZONE AS last_comment_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON INDEX idx_comments_created_at IS 
'Index to optimize time-based queries on comments';

COMMENT ON INDEX idx_comments_review_created IS 
'Index to optimize per-review comment queries with time filtering';

COMMENT ON INDEX idx_comments_parent IS 
'Index to optimize queries for comment replies';

COMMENT ON FUNCTION check_daily_comment_limit IS 
'Optional function to check if daily comment limit is reached. Currently defers to client-side enforcement.';

COMMENT ON FUNCTION get_comment_stats IS 
'Optional function to retrieve comment statistics. Template for future server-side tracking.';

-- Optional: Add session_id column for future server-side tracking
-- Uncomment if you want to implement server-side rate limiting
-- ALTER TABLE comments ADD COLUMN IF NOT EXISTS session_id TEXT;
-- CREATE INDEX IF NOT EXISTS idx_comments_session ON comments(session_id, created_at DESC);
-- COMMENT ON COLUMN comments.session_id IS 'Session ID for rate limiting purposes';
