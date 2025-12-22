import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mockReviews, USE_MOCK_DATA } from '@/data/mockReviews';

interface GlobalStats {
  totalReviews: number;
  totalLikes: number;
  totalViews: number;
  totalComments: number;
}

export const useGlobalStats = () => {
  const [stats, setStats] = useState<GlobalStats>({
    totalReviews: 0,
    totalLikes: 0,
    totalViews: 0,
    totalComments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        // Si USE_MOCK_DATA está activado, calcular desde datos locales
        if (USE_MOCK_DATA) {
          const totalLikes = mockReviews.reduce((sum, review) => sum + (review.likes_count || 0), 0);
          const totalViews = mockReviews.reduce((sum, review) => sum + (review.views_count || 0), 0);
          const totalComments = mockReviews.reduce((sum, review) => sum + (review.comments_count || 0), 0);
          
          setStats({
            totalReviews: mockReviews.length,
            totalLikes,
            totalViews,
            totalComments
          });
          setLoading(false);
          return;
        }

        // Si no, obtener desde Supabase
        const { data, error } = await supabase
          .from('reviews')
          .select('likes_count, dislikes_count, views_count, comments_count');

        if (error) throw error;

        if (data) {
          const totalLikes = data.reduce((sum, review) => sum + (review.likes_count || 0), 0);
          const totalViews = data.reduce((sum, review) => sum + (review.views_count || 0), 0);
          const totalComments = data.reduce((sum, review) => sum + (review.comments_count || 0), 0);

          setStats({
            totalReviews: data.length,
            totalLikes,
            totalViews,
            totalComments
          });
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching global stats:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalStats();

    // Set up realtime subscription if not using mock data
    if (!USE_MOCK_DATA) {
      const channel = supabase
        .channel('global-stats')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reviews'
          },
          () => {
            fetchGlobalStats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  return { stats, loading };
};
