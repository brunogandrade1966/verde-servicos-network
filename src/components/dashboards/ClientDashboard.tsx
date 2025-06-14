
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Plus, Eye, Calendar, MapPin, DollarSign, LogOut, Users } from 'lucide-react';
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
  applications: {
    id: string;
  }[];
}

const ClientDashboard = () => {
  const { profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          services(name),
          applications(id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar projetos",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
                <p className="text-sm text-gray-500">Painel do Cliente</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/professionals')}>
                <Users className="h-4 w-4 mr-2" />
                Encontrar Profissionais
              </Button>
              <span className="text-sm text-gray-700">Olá, {profile?.name}</span>
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
                {projects.length}
              </CardTitle>
              <CardDescription>Projetos Totais</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.status === 'open').length}
              </CardTitle>
              <CardDescription>Projetos Abertos</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-orange-600">
                {projects.filter(p => p.status === 'in_progress').length}
              </CardTitle>
              <CardDescription>Em Andamento</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-purple-600">
                {projects.reduce((sum, p) => sum + (p.applications?.length || 0), 0)}
              </CardTitle>
              <CardDescription>Candidaturas Recebidas</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Meus Projetos</h2>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => navigate('/professionals')}>
              <Users className="h-4 w-4 mr-2" />
              Buscar Profissionais
            </Button>
            <Button onClick={() => navigate('/projects/new')} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Comece criando seu primeiro projeto para encontrar profissionais ambientais.
              </p>
              <Button onClick={() => navigate('/projects/new')} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                      <CardDescription className="mb-3">
                        {project.description.length > 150 
                          ? `${project.description.substring(0, 150)}...` 
                          : project.description
                        }
                      </CardDescription>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Badge variant="outline">{project.services?.name}</Badge>
                        </span>
                        {project.location && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {project.location}
                          </span>
                        )}
                        {project.deadline && (
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(project.deadline).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(project.status)}
                      {project.applications && project.applications.length > 0 && (
                        <Badge variant="secondary">
                          {project.applications.length} candidatura{project.applications.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm">
                      {(project.budget_min || project.budget_max) && (
                        <span className="flex items-center text-green-600 font-medium">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {project.budget_min && project.budget_max 
                            ? `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`
                            : formatCurrency(project.budget_min || project.budget_max)
                          }
                        </span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
