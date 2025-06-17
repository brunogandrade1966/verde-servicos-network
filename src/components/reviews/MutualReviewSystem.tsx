
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Users } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MutualReviewSystemProps {
  projectId?: string;
  partnershipDemandId?: string;
  professionalId: string;
  professionalName: string;
  clientId?: string;
  contractorId?: string;
  status: string;
}

const MutualReviewSystem = ({
  projectId,
  partnershipDemandId,
  professionalId,
  professionalName,
  clientId,
  contractorId,
  status
}: MutualReviewSystemProps) => {
  const { profile } = useAuth();
  const { createReview } = useReviews(profile?.id);
  const { toast } = useToast();
  const [showProfessionalReviewDialog, setShowProfessionalReviewDialog] = useState(false);
  const [showClientReviewDialog, setShowClientReviewDialog] = useState(false);
  const [hasReviewedProfessional, setHasReviewedProfessional] = useState(false);
  const [hasReviewedClient, setHasReviewedClient] = useState(false);
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    checkExistingReviews();
    fetchClientName();
  }, [projectId, partnershipDemandId, profile?.id]);

  const fetchClientName = async () => {
    if (!clientId && !contractorId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', clientId || contractorId)
        .single();

      if (data && !error) {
        setClientName(data.name);
      }
    } catch (error) {
      console.error('Error fetching client name:', error);
    }
  };

  const checkExistingReviews = async () => {
    if (!profile?.id || status !== 'completed') return;

    try {
      const reviewId = projectId || partnershipDemandId;
      if (!reviewId) return;

      // Verificar se já avaliou o profissional
      const { data: professionalReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('project_id', reviewId)
        .eq('reviewer_id', profile.id)
        .eq('reviewed_id', professionalId)
        .single();

      setHasReviewedProfessional(!!professionalReview);

      // Verificar se já avaliou o cliente (apenas para profissionais)
      if (profile.user_type === 'professional' && (clientId || contractorId)) {
        const { data: clientReview } = await supabase
          .from('reviews')
          .select('id')
          .eq('project_id', reviewId)
          .eq('reviewer_id', profile.id)
          .eq('reviewed_id', clientId || contractorId)
          .single();

        setHasReviewedClient(!!clientReview);
      }
    } catch (error) {
      console.error('Error checking existing reviews:', error);
    }
  };

  const handleProfessionalReviewSubmit = async (reviewData: { rating: number; comment?: string }) => {
    const review = await createReview({
      project_id: projectId || partnershipDemandId || '',
      reviewed_id: professionalId,
      rating: reviewData.rating,
      comment: reviewData.comment
    });

    if (review) {
      setShowProfessionalReviewDialog(false);
      setHasReviewedProfessional(true);
      
      toast({
        title: "Avaliação enviada!",
        description: `Você avaliou ${professionalName}.`
      });
    }
  };

  const handleClientReviewSubmit = async (reviewData: { rating: number; comment?: string }) => {
    const review = await createReview({
      project_id: projectId || partnershipDemandId || '',
      reviewed_id: clientId || contractorId || '',
      rating: reviewData.rating,
      comment: reviewData.comment
    });

    if (review) {
      setShowClientReviewDialog(false);
      setHasReviewedClient(true);
      
      toast({
        title: "Avaliação enviada!",
        description: `Você avaliou ${clientName}.`
      });
    }
  };

  if (status !== 'completed') {
    return null;
  }

  const isProfessional = profile?.user_type === 'professional';
  const isClient = profile?.user_type === 'client';
  const canReviewProfessional = (isClient || (isProfessional && contractorId)) && !hasReviewedProfessional;
  const canReviewClient = isProfessional && (clientId || contractorId) && !hasReviewedClient;

  if (!canReviewProfessional && !canReviewClient) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Users className="h-5 w-5" />
          Sistema de Avaliações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {canReviewProfessional && (
          <Dialog open={showProfessionalReviewDialog} onOpenChange={setShowProfessionalReviewDialog}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Avaliar {professionalName}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Avaliar Profissional</DialogTitle>
              </DialogHeader>
              <ReviewForm
                projectId={projectId || partnershipDemandId || ''}
                reviewedId={professionalId}
                reviewedName={professionalName}
                onSubmit={handleProfessionalReviewSubmit}
              />
            </DialogContent>
          </Dialog>
        )}

        {canReviewClient && clientName && (
          <Dialog open={showClientReviewDialog} onOpenChange={setShowClientReviewDialog}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Avaliar {clientName}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Avaliar Cliente</DialogTitle>
              </DialogHeader>
              <ReviewForm
                projectId={projectId || partnershipDemandId || ''}
                reviewedId={clientId || contractorId || ''}
                reviewedName={clientName}
                onSubmit={handleClientReviewSubmit}
              />
            </DialogContent>
          </Dialog>
        )}

        {hasReviewedProfessional && hasReviewedClient && (
          <p className="text-sm text-blue-700 text-center">
            ✓ Todas as avaliações foram enviadas
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MutualReviewSystem;
