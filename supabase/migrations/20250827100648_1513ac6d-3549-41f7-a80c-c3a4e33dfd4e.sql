-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_review_stats()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_TABLE_NAME = 'comments' THEN
    -- Update comments count
    UPDATE public.reviews 
    SET comments_count = (
      SELECT COUNT(*) FROM public.comments 
      WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
    )
    WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  ELSIF TG_TABLE_NAME = 'review_likes' THEN
    -- Update likes and dislikes count
    UPDATE public.reviews 
    SET 
      likes_count = (
        SELECT COUNT(*) FROM public.review_likes 
        WHERE review_id = COALESCE(NEW.review_id, OLD.review_id) AND is_like = true
      ),
      dislikes_count = (
        SELECT COUNT(*) FROM public.review_likes 
        WHERE review_id = COALESCE(NEW.review_id, OLD.review_id) AND is_like = false
      )
    WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;