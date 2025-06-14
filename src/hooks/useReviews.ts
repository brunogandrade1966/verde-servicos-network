
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer: {
    name: string;
    avatar_url?: string;
  };
  project: {
    title: string;
  };
}

interface CreateReviewData {
  project_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
}

export const useReviews = (userId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(name, avatar_url),
          project:projects(title)
        `)
        .eq('reviewed_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      setReviews(data as Review[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: CreateReviewData) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          ...reviewData,
          reviewer_id: userId
        })
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(name, avatar_url),
          project:projects(title)
        `)
        .single();

      if (error) {
        toast({
          title: "Erro ao criar avaliação",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Avaliação criada!",
        description: "Sua avaliação foi enviada com sucesso."
      });

      setReviews(prev => [data as Review, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      toast({
        title: "Erro ao criar avaliação",
        description: "Não foi possível enviar sua avaliação.",
        variant: "destructive"
      });
      return null;
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  };

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  return {
    reviews,
    loading,
    createReview,
    averageRating: getAverageRating(),
    totalReviews: reviews.length,
    refreshReviews: fetchReviews
  };
};
