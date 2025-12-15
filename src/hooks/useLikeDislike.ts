import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useLikeDislike = (reviewSlug: string) => {
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  // Check if cooldown period has passed (4 hours)
  const canVote = (lastVoteKey: string): boolean => {
    const lastVoteTime = localStorage.getItem(lastVoteKey);
    if (!lastVoteTime) return true;
    
    const fourHoursInMs = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    const timeSinceLastVote = Date.now() - parseInt(lastVoteTime);
    
    return timeSinceLastVote >= fourHoursInMs;
  };

  // Get remaining cooldown time in minutes
  const getRemainingCooldown = (lastVoteKey: string): number => {
    const lastVoteTime = localStorage.getItem(lastVoteKey);
    if (!lastVoteTime) return 0;
    
    const fourHoursInMs = 4 * 60 * 60 * 1000;
    const timeSinceLastVote = Date.now() - parseInt(lastVoteTime);
    const remainingMs = fourHoursInMs - timeSinceLastVote;
    
    return remainingMs > 0 ? Math.ceil(remainingMs / 60000) : 0;
  };

  useEffect(() => {
    // Check if user has already voted
    const checkUserVote = async () => {
      const sessionId = getSessionId();
      
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('id')
        .eq('slug', reviewSlug)
        .single();

      if (reviewData) {
        const { data } = await supabase
          .from('review_likes')
          .select('is_like')
          .eq('review_id', reviewData.id)
          .eq('user_session', sessionId)
          .single();
        
        if (data) {
          setUserVote(data.is_like);
        }
      }
    };

    checkUserVote();
  }, [reviewSlug]);

  const handleVote = async (isLike: boolean) => {
    const voteKey = `vote_cooldown_${reviewSlug}`;
    
    // Check cooldown
    if (!canVote(voteKey)) {
      const remainingMinutes = getRemainingCooldown(voteKey);
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;
      
      toast({
        title: "Espera un momento",
        description: `Podrás cambiar tu voto en ${hours}h ${minutes}min`,
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const sessionId = getSessionId();
      
      // Get review ID
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('id')
        .eq('slug', reviewSlug)
        .single();

      if (!reviewData) {
        throw new Error('Review not found');
      }

      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('review_likes')
        .select('*')
        .eq('review_id', reviewData.id)
        .eq('user_session', sessionId)
        .single();

      if (existingVote) {
        if (existingVote.is_like === isLike) {
          // Remove vote if clicking the same button
          await supabase
            .from('review_likes')
            .delete()
            .eq('id', existingVote.id);
          
          setUserVote(null);
          localStorage.removeItem(voteKey);
          toast({
            title: "Voto eliminado",
            description: "Has retirado tu valoración"
          });
        } else {
          // Update vote if clicking opposite button
          await supabase
            .from('review_likes')
            .update({ is_like: isLike })
            .eq('id', existingVote.id);
          
          setUserVote(isLike);
          localStorage.setItem(voteKey, Date.now().toString());
          toast({
            title: isLike ? "Me gusta" : "No me gusta",
            description: "Tu valoración ha sido actualizada"
          });
        }
      } else {
        // Create new vote
        await supabase
          .from('review_likes')
          .insert({
            review_id: reviewData.id,
            user_session: sessionId,
            is_like: isLike
          });
        
        setUserVote(isLike);
        localStorage.setItem(voteKey, Date.now().toString());
        toast({
          title: isLike ? "Me gusta" : "No me gusta",
          description: "¡Gracias por tu valoración!"
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar tu voto. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { userVote, handleVote, loading };
};