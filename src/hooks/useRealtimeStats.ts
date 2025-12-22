import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ReviewStats {
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  views_count: number;
}

export const useRealtimeStats = (reviewSlug: string) => {
  const [stats, setStats] = useState<ReviewStats>({
    likes_count: 0,
    dislikes_count: 0,
    comments_count: 0,
    views_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial stats
    const fetchStats = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('likes_count, dislikes_count, comments_count, views_count')
        .eq('slug', reviewSlug)
        .single();
      
      if (data) {
        setStats(data);
      }
      setLoading(false);
    };

    fetchStats();

    // Set up realtime subscription
    const channel = supabase
      .channel('review-stats')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reviews',
          filter: `slug=eq.${reviewSlug}`
        },
        (payload) => {
          const newStats = payload.new as any;
          setStats({
            likes_count: newStats.likes_count,
            dislikes_count: newStats.dislikes_count,
            comments_count: newStats.comments_count,
            views_count: newStats.views_count
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reviewSlug]);

  return { stats, loading };
};

export const useRealtimeComments = (reviewSlug: string) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial comments
    const fetchComments = async () => {
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('id')
        .eq('slug', reviewSlug)
        .single();

      if (reviewData) {
        const { data } = await supabase
          .from('comments')
          .select('*')
          .eq('review_id', reviewData.id)
          .order('created_at', { ascending: false });
        
        if (data) {
          setComments(data);
        }
      }
      setLoading(false);
    };

    fetchComments();

    // Set up realtime subscription for comments
    const channel = supabase
      .channel('review-comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments'
        },
        (payload) => {
          setComments(prev => [payload.new as any, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'comments'
        },
        (payload) => {
          setComments(prev => 
            prev.map(comment => 
              comment.id === payload.new.id ? payload.new as any : comment
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reviewSlug]);

  return { comments, loading };
};

export const usePageViews = () => {
  const recordPageView = async (pageType: string, reviewSlug?: string) => {
    try {
      // Generate a simple session ID (you might want to use a more sophisticated approach)
      const sessionId = sessionStorage.getItem('session_id') || 
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', sessionId);
      }

      let review_id = null;
      if (reviewSlug) {
        const { data } = await supabase
          .from('reviews')
          .select('id')
          .eq('slug', reviewSlug)
          .single();
        review_id = data?.id;
      }

      await supabase.from('page_views').insert({
        page_type: pageType,
        review_id,
        user_session: sessionId,
        user_agent: navigator.userAgent
      });

      // Also update view count for review if applicable
      if (review_id) {
        const { data: currentReview } = await supabase
          .from('reviews')
          .select('views_count')
          .eq('id', review_id)
          .single();

        if (currentReview) {
          await supabase
            .from('reviews')
            .update({ views_count: currentReview.views_count + 1 })
            .eq('id', review_id);
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error recording page view:', error);
      }
    }
  };

  return { recordPageView };
};