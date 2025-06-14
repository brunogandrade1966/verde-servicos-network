
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/hooks/useReviews';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReviewForm from '@/components/reviews/ReviewForm';

interface Project {
  id: string;
  title: string;
  status: string;
  professional: {
    id: string;
    name: string;
  };
}

const ReviewProfessional = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { createReview } = useReviews(profile?.id);
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          status,
          applications!inner(
            status,
            profiles!inner(id, name)
          )
        `)
        .eq('id', projectId)
        .eq('client_id', profile?.id)
        .eq('status', 'completed')
        .eq('applications.status', 'accepted')
        .single();

      if (error) {
        toast({
          title: "Erro ao carregar projeto",
          description: error.message,
          variant: "destructive"
        });
        navigate('/contracted-projects');
        return;
      }

      // Check if review already exists
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('project_id', projectId)
        .eq('reviewer_id', profile?.id)
        .single();

      if (existingReview) {
        toast({
          title: "Avaliação já enviada",
          description: "Você já avaliou este profissional para este projeto.",
          variant: "destructive"
        });
        navigate('/contracted-projects');
        return;
      }

      const professional = data.applications[0]?.profiles;
      setProject({
        id: data.id,
        title: data.title,
        status: data.status,
        professional: {
          id: professional.id,
          name: professional.name
        }
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/contracted-projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData: { rating: number; comment?: string }) => {
    if (!project) return;

    setSubmitting(true);
    try {
      await createReview({
        project_id: project.id,
        reviewed_id: project.professional.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });

      navigate('/contracted-projects');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/contracted-projects')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Leaf className="h-8 w-8 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Avaliar Profissional</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Projeto não encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                O projeto não foi encontrado ou você não tem permissão para avaliá-lo.
              </p>
              <Button onClick={() => navigate('/contracted-projects')}>
                Voltar aos Projetos
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/contracted-projects')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">Avaliar Profissional</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Projeto: {project.title}
              </h2>
              <p className="text-gray-600">
                Avalie o trabalho realizado por <span className="font-medium">{project.professional.name}</span> neste projeto.
              </p>
            </CardContent>
          </Card>

          <ReviewForm
            projectId={project.id}
            reviewedId={project.professional.id}
            reviewedName={project.professional.name}
            onSubmit={handleSubmitReview}
            loading={submitting}
          />
        </div>
      </main>
    </div>
  );
};

export default ReviewProfessional;
