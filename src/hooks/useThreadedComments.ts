import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Comment {
  id: string;
  review_id: string;
  author_name: string;
  content: string;
  likes_count: number;
  created_at: string;
  parent_comment_id: string | null;
  replies?: Comment[];
}

export const useThreadedComments = (reviewSlug: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data: reviewData } = await supabase
          .from('reviews')
          .select('id')
          .eq('slug', reviewSlug)
          .single();

        if (reviewData) {
          const { data: commentsData, error } = await supabase
            .from('comments')
            .select('*')
            .eq('review_id', reviewData.id)
            .order('created_at', { ascending: true });

          if (error) throw error;

          if (commentsData) {
            // Organize comments into threads
            const organized = organizeComments(commentsData);
            setComments(organized);
          }
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();

    // Set up realtime subscription
    const channel = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments'
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reviewSlug]);

  return { comments, loading };
};

// Helper function to organize flat comments into threaded structure
function organizeComments(flatComments: any[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create all comment objects
  flatComments.forEach(comment => {
    commentMap.set(comment.id, {
      ...comment,
      replies: []
    });
  });

  // Second pass: organize into threads
  flatComments.forEach(comment => {
    const commentObj = commentMap.get(comment.id)!;
    
    if (comment.parent_comment_id) {
      // This is a reply, add it to parent's replies
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies!.push(commentObj);
      }
    } else {
      // This is a root comment
      rootComments.push(commentObj);
    }
  });

  return rootComments;
}
