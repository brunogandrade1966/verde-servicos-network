
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Leaf, ArrowLeft, DollarSign, Calendar, MapPin, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
  };
}

const ApplyToProject = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    proposedPrice: '',
    estimatedDuration: '',
    proposal: ''
  });

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          services(name, category),
          profiles(name)
        `)
        .eq('id', id)
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
    
    if (!profile || !project) return;

    if (!formData.proposal.trim()) {
      toast({
        title: "Erro",
        description: "A proposta é obrigatória",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const applicationData: any = {
        project_id: project.id,
        professional_id: profile.id,
        proposal: formData.proposal,
        status: 'pending'
      };

      if (formData.proposedPrice) {
        applicationData.proposed_price = parseFloat(formData.proposedPrice);
      }

      if (formData.estimatedDuration) {
        applicationData.estimated_duration = formData.estimatedDuration;
      }

      const { error } = await supabase
        .from('applications')
        .insert([applicationData]);

      if (error) {
        toast({
          title: "Erro ao enviar candidatura",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Candidatura enviada!",
        description: "Sua candidatura foi enviada com sucesso. O cliente será notificado.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua candidatura",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Projeto não encontrado
              </h3>
              <Button onClick={() => navigate('/projects')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Projetos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Candidatar-se ao Projeto</h1>
                <p className="text-sm text-gray-500">Envie sua proposta para este projeto</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{project.services?.name}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cliente:</h4>
                  <p className="text-sm text-gray-600">{project.profiles?.name}</p>
                </div>

                {(project.budget_min || project.budget_max) && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {project.budget_min && project.budget_max 
                        ? `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`
                        : formatCurrency(project.budget_min || project.budget_max)
                      }
                    </span>
                  </div>
                )}

                {project.deadline && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {new Date(project.deadline).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}

                {project.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descrição:</h4>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sua Proposta</CardTitle>
                <CardDescription>
                  Preencha os detalhes da sua candidatura para este projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="proposedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Preço Proposto (Opcional)
                    </label>
                    <Input
                      id="proposedPrice"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 5000.00"
                      value={formData.proposedPrice}
                      onChange={(e) => setFormData({ ...formData, proposedPrice: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-1">
                      Prazo Estimado (Opcional)
                    </label>
                    <Input
                      id="estimatedDuration"
                      placeholder="Ex: 30 dias, 2 semanas, 1 mês"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-1">
                      Proposta *
                    </label>
                    <Textarea
                      id="proposal"
                      placeholder="Descreva sua abordagem para este projeto, sua experiência relevante e por que você é a melhor escolha..."
                      rows={6}
                      value={formData.proposal}
                      onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/projects')}
                      disabled={submitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar Candidatura'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplyToProject;
