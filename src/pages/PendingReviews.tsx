import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin } from 'lucide-react';
import { MutualReviewForm } from '@/components/reviews/MutualReviewForm';
import { useMutualReviews } from '@/hooks/useMutualReviews';
import ClientLayout from '@/components/layout/ClientLayout';
import { useState } from 'react';

export default function PendingReviews() {
  const { pendingReviews, loading, submitReview } = useMutualReviews();
  const [reviewingProject, setReviewingProject] = useState<string | null>(null);

  const handleReviewSubmitted = () => {
    setReviewingProject(null);
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando avaliações pendentes...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (pendingReviews.length === 0) {
    return (
      <ClientLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Avaliações Pendentes</h1>
          
          <Card>
            <CardContent className="text-center py-12">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação pendente</h3>
              <p className="text-muted-foreground">
                Você não possui projetos finalizados aguardando avaliação.
              </p>
            </CardContent>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Avaliações Pendentes</h1>
          <Badge variant="secondary">
            {pendingReviews.length} pendente{pendingReviews.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="grid gap-6">
          {pendingReviews.map((review) => (
            <Card key={review.project_id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{review.project_title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4" />
                      Projeto finalizado
                    </CardDescription>
                  </div>
                  <Badge variant="outline">Aguardando avaliação</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {reviewingProject === review.project_id ? (
                  <MutualReviewForm
                    projectId={review.project_id}
                    reviewedUserId={
                      review.client_id === review.professional_id 
                        ? review.professional_id 
                        : review.client_id
                    }
                    reviewedUserName={
                      review.client_id === review.professional_id 
                        ? review.professional_name 
                        : review.client_name
                    }
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Avaliar: {review.client_id === review.professional_id 
                            ? review.professional_name 
                            : review.client_name}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setReviewingProject(review.project_id)}
                      className="w-full"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Avaliar Agora
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}