import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Search, Users, Briefcase, Star, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  };
  profiles: {
    name: string;
  };
}

interface Application {
  id: string;
  status: string;
  proposed_price?: number;
  created_at: string;
  projects: {
    title: string;
    status: string;
  };
}

const ProfessionalDashboard = () => {
  const { profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch open projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          services(name),
          profiles(name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10);

      if (projectsError) {
        toast({
          title: "Erro ao carregar projetos",
          description: projectsError.message,
          variant: "destructive"
        });
      } else {
        setProjects(projectsData || []);
      }

      // Fetch user applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          projects(title, status)
        `)
        .order('created_at', { ascending: false });

      if (applicationsError) {
        toast({
          title: "Erro ao carregar candidaturas",
          description: applicationsError.message,
          variant: "destructive"
        });
      } else {
        setApplications(applicationsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getApplicationStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendente', variant: 'outline' as const },
      accepted: { label: 'Aceita', variant: 'default' as const },
      rejected: { label: 'Rejeitada', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ambiental Partners</h1>
                <p className="text-sm text-gray-500">Painel do Profissional</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {profile?.name}</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                <Star className="h-4 w-4 mr-2" />
                Perfil
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                {applications.length}
              </CardTitle>
              <CardDescription>Candidaturas Enviadas</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-600">
                {applications.filter(a => a.status === 'pending').length}
              </CardTitle>
              <CardDescription>Aguardando Resposta</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-orange-600">
                {applications.filter(a => a.status === 'accepted').length}
              </CardTitle>
              <CardDescription>Candidaturas Aceitas</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-purple-600">
                {projects.length}
              </CardTitle>
              <CardDescription>Novos Projetos</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4 mb-6">
          <Button onClick={() => navigate('/projects')} className="bg-green-600 hover:bg-green-700">
            <Search className="h-4 w-4 mr-2" />
            Buscar Projetos
          </Button>
          <Button variant="outline" onClick={() => navigate('/professionals')}>
            <Users className="h-4 w-4 mr-2" />
            Encontrar Profissionais
          </Button>
          <Button variant="outline" onClick={() => navigate('/my-services')}>
            <Briefcase className="h-4 w-4 mr-2" />
            Meus Serviços
          </Button>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            <Star className="h-4 w-4 mr-2" />
            Meu Perfil
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Projetos Recentes</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum projeto disponível
                  </h3>
                  <p className="text-gray-500">
                    Não há projetos abertos no momento.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Por {project.profiles?.name}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{project.services?.name}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        {project.description.length > 100 
                          ? `${project.description.substring(0, 100)}...` 
                          : project.description
                        }
                      </p>
                      <div className="flex justify-between items-center">
                        {(project.budget_min || project.budget_max) && (
                          <span className="text-sm text-green-600 font-medium">
                            {project.budget_min && project.budget_max 
                              ? `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`
                              : formatCurrency(project.budget_min || project.budget_max)
                            }
                          </span>
                        )}
                        <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                          Ver Projeto
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* My Applications */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Minhas Candidaturas</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma candidatura enviada
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Comece a se candidatar a projetos para expandir seus negócios.
                  </p>
                  <Button onClick={() => navigate('/projects')} className="bg-green-600 hover:bg-green-700">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar Projetos
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <Card key={application.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{application.projects?.title}</CardTitle>
                        {getApplicationStatusBadge(application.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          Enviada em {new Date(application.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        {application.proposed_price && (
                          <span className="text-green-600 font-medium">
                            {formatCurrency(application.proposed_price)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
