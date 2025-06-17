
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, Star } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ServiceCompletionConfirmationProps {
  projectId?: string;
  partnershipDemandId?: string;
  providerId: string; // ID do profissional que prestou o serviço
  providerName: string;
  clientId?: string; // ID do cliente (para projetos)
  contractorId?: string; // ID do profissional contratante (para parcerias)
  status: string;
  onConfirmation: () => void;
}

const ServiceCompletionConfirmation = ({
  projectId,
  partnershipDemandId,
  providerId,
  providerName,
  clientId,
  contractorId,
  status,
  onConfirmation
}: ServiceCompletionConfirmationProps) => {
  const { profile } = useAuth();
  const { createReview } = useReviews(profile?.id);
  const { toast } = useToast();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const canConfirm = status === 'completed' && !confirmed && (
    (projectId && profile?.id === clientId) ||
    (partnershipDemandId && profile?.id === contractorId)
  );

  const handleConfirmCompletion = async () => {
    setConfirmed(true);
    setShowReviewDialog(true);
    
    toast({
      title: "Serviço confirmado!",
      description: "Agora você pode avaliar o profissional."
    });
  };

  const handleReviewSubmit = async (reviewData: { rating: number; comment?: string }) => {
    const review = await createReview({
      project_id: projectId || partnershipDemandId || '',
      reviewed_id: providerId,
      rating: reviewData.rating,
      comment: reviewData.comment
    });

    if (review) {
      setShowReviewDialog(false);
      onConfirmation();
      
      toast({
        title: "Avaliação enviada!",
        description: "Obrigado pelo seu feedback."
      });
    }
  };

  if (!canConfirm && !confirmed) {
    return null;
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          Confirmação de Conclusão
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!confirmed ? (
          <div className="space-y-4">
            <p className="text-green-700">
              O profissional {providerName} marcou este serviço como concluído. 
              Confirme se o serviço foi executado adequadamente.
            </p>
            <Button 
              onClick={handleConfirmCompletion}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Confirmar Conclusão do Serviço
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Serviço confirmado como concluído!
            </p>
            
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Avaliar {providerName}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Avaliar Profissional</DialogTitle>
                </DialogHeader>
                <ReviewForm
                  projectId={projectId || partnershipDemandId || ''}
                  reviewedId={providerId}
                  reviewedName={providerName}
                  onSubmit={handleReviewSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCompletionConfirmation;
