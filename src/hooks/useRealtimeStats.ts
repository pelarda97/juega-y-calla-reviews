import { useEffect, useState, useCallback } from 'react';
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
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('likes_count, dislikes_count, comments_count, views_count')
          .eq('slug', reviewSlug)
          .single();
        
        if (data && !error) {
          setStats(data);
        }
      } catch (error) {
        // Si hay error (ej: Supabase pausado), mantener stats en 0
        if (import.meta.env.DEV) {
          console.error('Error fetching stats:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Poll stats every 30 seconds instead of Realtime (reduces egress from 1GB to ~50MB)
    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // 30 seconds

    return () => {
      clearInterval(interval);
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
  const recordPageView = useCallback(async (pageType: string, reviewSlug?: string) => {
    try {
      // Generate a simple session ID
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

        // Verificar si esta sesión ya registró una visita a esta review
        const viewKey = `viewed_${reviewSlug}`;
        if (sessionStorage.getItem(viewKey)) {
          // Ya registramos esta visita, no duplicar
          return;
        }

        // Marcar como visitada en esta sesión
        sessionStorage.setItem(viewKey, 'true');
      }

      // Insert page view - el trigger incrementará views_count automáticamente
      await supabase.from('page_views').insert({
        page_type: pageType,
        review_id,
        user_session: sessionId,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error recording page view:', error);
      }
    }
  }, []); // useCallback sin dependencias (supabase es estable)

  return { recordPageView };
};