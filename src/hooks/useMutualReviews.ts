import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProjectReview {
  project_id: string;
  client_id: string;
  professional_id: string;
  project_title: string;
  client_name: string;
  professional_name: string;
  client_reviewed: boolean;
  professional_reviewed: boolean;
}

export const useMutualReviews = () => {
  const { profile } = useAuth();
  const [pendingReviews, setPendingReviews] = useState<ProjectReview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      loadPendingReviews();
    }
  }, [profile]);

  const loadPendingReviews = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      // Buscar projetos finalizados onde o usuário ainda não avaliou
      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          client_id,
          status,
          applications!inner(
            professional_id,
            status
          )
        `)
        .eq('status', 'completed')
        .eq('applications.status', 'accepted');

      if (error) throw error;

      const reviewPromises = projects?.map(async (project) => {
        const application = project.applications[0];
        
        // Verificar se já existem avaliações
        const { data: existingReviews } = await supabase
          .from('reviews')
          .select('reviewer_id, reviewed_id')
          .eq('project_id', project.id);

        const clientReviewed = existingReviews?.some(
          r => r.reviewer_id === project.client_id && r.reviewed_id === application.professional_id
        );
        
        const professionalReviewed = existingReviews?.some(
          r => r.reviewer_id === application.professional_id && r.reviewed_id === project.client_id
        );

        // Buscar nomes dos usuários
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', [project.client_id, application.professional_id]);

        const clientProfile = profilesData?.find(p => p.id === project.client_id);
        const professionalProfile = profilesData?.find(p => p.id === application.professional_id);

        return {
          project_id: project.id,
          client_id: project.client_id,
          professional_id: application.professional_id,
          project_title: project.title,
          client_name: clientProfile?.name || 'Cliente',
          professional_name: professionalProfile?.name || 'Profissional',
          client_reviewed: clientReviewed || false,
          professional_reviewed: professionalReviewed || false
        };
      }) || [];

      const reviewsData = await Promise.all(reviewPromises);
      
      // Filtrar apenas projetos onde o usuário atual ainda precisa avaliar
      const userPendingReviews = reviewsData.filter(review => {
        if (profile.user_type === 'client' && review.client_id === profile.id) {
          return !review.client_reviewed;
        }
        if (profile.user_type === 'professional' && review.professional_id === profile.id) {
          return !review.professional_reviewed;
        }
        return false;
      });

      setPendingReviews(userPendingReviews);
    } catch (error) {
      console.error('Error loading pending reviews:', error);
      toast.error('Erro ao carregar avaliações pendentes');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (projectId: string, reviewedUserId: string, rating: number, comment?: string) => {
    if (!profile) return { success: false };

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          project_id: projectId,
          reviewer_id: profile.id,
          reviewed_id: reviewedUserId,
          rating,
          comment: comment || null
        });

      if (error) throw error;

      // Atualizar a lista de avaliações pendentes
      await loadPendingReviews();
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting review:', error);
      return { success: false, error };
    }
  };

  return {
    pendingReviews,
    loading,
    loadPendingReviews,
    submitReview
  };
};