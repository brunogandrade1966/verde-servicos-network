
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, ArrowLeft, Calendar, MapPin, DollarSign, Users, User, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  created_at: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
  };
  applications: Application[];
}

interface Application {
  id: string;
  proposed_price?: number;
  proposal: string;
  status: string;
  estimated_duration?: string;
  created_at: string;
  profiles: {
    name: string;
    bio?: string;
    avatar_url?: string;
  };
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

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
          profiles(name),
          applications(
            id,
            proposed_price,
            proposal,
            status,
            estimated_duration,
            created_at,
            profiles(name, bio, avatar_url)
          )
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: 'Rascunho', variant: 'secondary' as const },
      open: { label: 'Aberto', variant: 'default' as const },
      in_progress: { label: 'Em Andamento', variant: 'outline' as const },
      completed: { label: 'Concluído', variant: 'default' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
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
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Detalhes do Projeto</h1>
                <p className="text-sm text-gray-500">Informações e candidaturas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                    <div className="flex items-center space-x-4 mb-4">
                      {getStatusBadge(project.status)}
                      <Badge variant="outline">{project.services?.name}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(project.budget_min || project.budget_max) && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">Orçamento:</span>
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
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">Prazo:</span>
                        <span className="text-sm">
                          {new Date(project.deadline).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}

                    {project.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium">Localização:</span>
                        <span className="text-sm">{project.location}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium">Cliente:</span>
                      <span className="text-sm">{project.profiles?.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Candidaturas ({project.applications?.length || 0})
                </CardTitle>
                <CardDescription>
                  Profissionais interessados neste projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.applications && project.applications.length > 0 ? (
                  <div className="space-y-4">
                    {project.applications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {application.profiles?.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(application.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <Badge variant={application.status === 'pending' ? 'secondary' : 'default'}>
                            {application.status === 'pending' ? 'Pendente' : application.status}
                          </Badge>
                        </div>

                        <p className="text-gray-700 mb-3">{application.proposal}</p>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            {application.proposed_price && (
                              <span className="text-green-600 font-medium">
                                {formatCurrency(application.proposed_price)}
                              </span>
                            )}
                            {application.estimated_duration && (
                              <span className="text-gray-500">
                                Prazo: {application.estimated_duration}
                              </span>
                            )}
                          </div>
                          {profile?.user_type === 'client' && application.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Ver Perfil
                              </Button>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Aceitar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Nenhuma candidatura recebida ainda.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Categoria:</span>
                  <p className="text-sm">{project.services?.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Criado em:</span>
                  <p className="text-sm">
                    {new Date(project.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <div className="mt-1">
                    {getStatusBadge(project.status)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {profile?.user_type === 'client' && (
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    Editar Projeto
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Buscar Profissionais
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
