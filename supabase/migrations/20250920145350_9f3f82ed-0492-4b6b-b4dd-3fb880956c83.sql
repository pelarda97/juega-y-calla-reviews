-- Reset all counters to 0
UPDATE reviews SET 
  views_count = 0,
  likes_count = 0, 
  dislikes_count = 0,
  comments_count = 0;

-- Create trigger to automatically count page views
CREATE OR REPLACE FUNCTION public.increment_view_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only count if it's a review page view
  IF NEW.page_type = 'review' AND NEW.review_id IS NOT NULL THEN
    UPDATE public.reviews 
    SET views_count = views_count + 1
    WHERE id = NEW.review_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for page views
DROP TRIGGER IF EXISTS trigger_increment_view_count ON public.page_views;
CREATE TRIGGER trigger_increment_view_count
  AFTER INSERT ON public.page_views
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_view_count();

-- Update existing trigger to handle all stats correctly
DROP TRIGGER IF EXISTS trigger_update_review_stats_comments ON public.comments;
DROP TRIGGER IF EXISTS trigger_update_review_stats_likes ON public.review_likes;

CREATE TRIGGER trigger_update_review_stats_comments
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_stats();

CREATE TRIGGER trigger_update_review_stats_likes
  AFTER INSERT OR UPDATE OR DELETE ON public.review_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_stats();