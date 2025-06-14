import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ClientLayout from '@/components/layout/ClientLayout';

interface Project {
  id: string;
  title: string;
  description: string;
  location?: string;
  deadline?: string;
  budget_min?: number;
  budget_max?: number;
  client_id: string;
  service_id: string;
  created_at: string;
  services: {
    name: string;
    category: string;
  };
}

const ApplyToProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [proposal, setProposal] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId]);

  const fetchProject = async (projectId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          services(name, category)
        `)
        .eq('id', projectId)
        .single();

      if (error) {
        toast({
          title: "Erro ao carregar projeto",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para se candidatar a um projeto.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          project_id: projectId,
          professional_id: profile.id,
          proposal: proposal,
          proposed_price: proposedPrice ? parseFloat(proposedPrice) : null,
          estimated_duration: estimatedDuration,
          status: 'pending',
        });

      if (error) {
        toast({
          title: "Erro ao enviar candidatura",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Candidatura enviada",
        description: "Sua candidatura foi enviada com sucesso!",
      });
      navigate('/browse-projects');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao enviar sua candidatura.",
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

  if (!project) {
    return (
      <ClientLayout>
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Projeto não encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              O projeto que você está tentando acessar não existe ou foi removido.
            </p>
            <Button onClick={() => navigate('/browse-projects')}>
              Voltar para Projetos
            </Button>
          </CardContent>
        </Card>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto">
        {/* Project Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Serviço:</strong> {project.services.name}
              </div>
              <div>
                <strong>Localização:</strong> {project.location || 'Não especificada'}
              </div>
              <div>
                <strong>Prazo:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString('pt-BR') : 'Flexível'}
              </div>
              {(project.budget_min || project.budget_max) && (
                <div className="md:col-span-3">
                  <strong>Orçamento:</strong> 
                  {project.budget_min && project.budget_max 
                    ? ` R$ ${project.budget_min.toLocaleString()} - R$ ${project.budget_max.toLocaleString()}`
                    : project.budget_min 
                    ? ` A partir de R$ ${project.budget_min.toLocaleString()}`
                    : ` Até R$ ${project.budget_max.toLocaleString()}`
                  }
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Candidatar-se ao Projeto</CardTitle>
            <CardDescription>
              Preencha os detalhes da sua proposta para este projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="proposal">Proposta *</Label>
                <Textarea
                  id="proposal"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Descreva sua abordagem para este projeto, sua experiência relevante e como você pretende executar o trabalho..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proposed_price">Preço Proposto (R$)</Label>
                  <Input
                    id="proposed_price"
                    type="number"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="estimated_duration">Prazo Estimado</Label>
                  <Input
                    id="estimated_duration"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder="Ex: 30 dias, 2 semanas, 3 meses"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/browse-projects')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !proposal.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? 'Enviando...' : 'Enviar Candidatura'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ApplyToProject;
