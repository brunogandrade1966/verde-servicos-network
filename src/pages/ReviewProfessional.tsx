
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import ClientLayout from '@/components/layout/ClientLayout';

interface Project {
  id: string;
  title: string;
  description: string;
}

interface Professional {
  id: string;
  name: string;
}

const ReviewProfessional = () => {
  const { projectId, professionalId } = useParams<{ projectId: string; professionalId: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('id, title, description')
          .eq('id', projectId)
          .single();

        if (projectError) {
          throw new Error(projectError.message);
        }

        setProject(projectData);

        // Fetch professional details
        const { data: professionalData, error: professionalError } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('id', professionalId)
          .single();

        if (professionalError) {
          throw new Error(professionalError.message);
        }

        setProfessional(professionalData);

        // Check if the user has already reviewed this professional for this project
        if (profile?.id && projectId && professionalId) {
          const { data: reviewData, error: reviewError } = await supabase
            .from('reviews')
            .select('*')
            .eq('project_id', projectId)
            .eq('reviewed_id', professionalId)
            .eq('reviewer_id', profile.id)
            .maybeSingle();

          if (reviewError) {
            console.error("Error fetching existing review:", reviewError);
          }

          setExistingReview(reviewData);
        }
      } catch (error: any) {
        toast({
          title: "Erro ao carregar informações",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, professionalId, profile?.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!profile?.id || !projectId || !professionalId) {
        throw new Error("Missing required information to submit the review.");
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          project_id: projectId,
          reviewed_id: professionalId,
          reviewer_id: profile.id,
          rating: rating,
          comment: comment,
        });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Avaliação enviada",
        description: "Obrigado por avaliar este profissional!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </ClientLayout>
    );
  }

  if (!project || !professional) {
    return (
      <ClientLayout>
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Projeto ou profissional não encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Não foi possível carregar as informações necessárias para a avaliação.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </ClientLayout>
    );
  }

  if (existingReview) {
    return (
      <ClientLayout>
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Avaliação já realizada
            </h3>
            <p className="text-gray-500 mb-4">
              Você já avaliou este profissional para este projeto.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Avaliar Profissional</CardTitle>
            <CardDescription>
              Avalie o trabalho realizado por {professional.name} no projeto "{project.title}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação *
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {rating === 0 && 'Selecione uma avaliação'}
                  {rating === 1 && 'Muito ruim'}
                  {rating === 2 && 'Ruim'}
                  {rating === 3 && 'Regular'}
                  {rating === 4 && 'Bom'}
                  {rating === 5 && 'Excelente'}
                </p>
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Comentário (opcional)
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Compartilhe sua experiência trabalhando com este profissional..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || rating === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? 'Enviando...' : 'Enviar Avaliação'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ReviewProfessional;
