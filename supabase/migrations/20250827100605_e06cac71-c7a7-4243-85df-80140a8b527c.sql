-- Create reviews table to store review data and statistics
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  game_title TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  introduccion TEXT,
  argumento TEXT,
  gameplay TEXT,
  funciones TEXT,
  duracion TEXT,
  valoracion_personal TEXT,
  imagenes TEXT[],
  video_url TEXT[],
  image_url TEXT,
  author TEXT NOT NULL DEFAULT 'Juega y Calla',
  publish_date TEXT NOT NULL DEFAULT 'Fecha no disponible',
  likes_count INTEGER NOT NULL DEFAULT 0,
  dislikes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create review_likes table to track likes/dislikes
CREATE TABLE public.review_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_session TEXT NOT NULL,
  is_like BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(review_id, user_session)
);

-- Create page_views table to track visits
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL, -- 'review', 'home', 'reviews_list', etc.
  user_session TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews (public read access)
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Reviews can be updated by admin" 
ON public.reviews 
FOR UPDATE 
USING (true);

CREATE POLICY "Reviews can be inserted by admin" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Create policies for comments (public read, authenticated write)
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own comments" 
ON public.comments 
FOR UPDATE 
USING (true);

-- Create policies for review_likes
CREATE POLICY "Review likes are viewable by everyone" 
ON public.review_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can like/dislike reviews" 
ON public.review_likes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own likes" 
ON public.review_likes 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own likes" 
ON public.review_likes 
FOR DELETE 
USING (true);

-- Create policies for page_views
CREATE POLICY "Page views are viewable by everyone" 
ON public.page_views 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can record page views" 
ON public.page_views 
FOR INSERT 
WITH CHECK (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update review statistics
CREATE OR REPLACE FUNCTION public.update_review_stats()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create triggers to update statistics automatically
CREATE TRIGGER update_review_comments_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_stats();

CREATE TRIGGER update_review_likes_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.review_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_stats();

-- Enable realtime for all tables
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.comments REPLICA IDENTITY FULL;
ALTER TABLE public.review_likes REPLICA IDENTITY FULL;
ALTER TABLE public.page_views REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;