
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, LogOut, Plus, Search, Eye, Users } from 'lucide-react';

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
}

const ClientDashboard = () => {
  const { profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          services(name)
        `)
        .eq('client_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar projetos",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Rascunho</Badge>;
      case 'open':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Aberto</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Em Andamento</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
              <span className="text-sm text-gray-700">Olá, {profile?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                {projects.length}
              </CardTitle>
              <CardDescription>Projetos Criados</CardDescription>
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
                {projects.filter(p => p.status === 'completed').length}
              </CardTitle>
              <CardDescription>Concluídos</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4 mb-8">
          <Button onClick={() => navigate('/projects/new')} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Criar Projeto
          </Button>
          <Button variant="outline" onClick={() => navigate('/projects')}>
            <Search className="h-4 w-4 mr-2" />
            Buscar Projetos
          </Button>
          <Button variant="outline" onClick={() => navigate('/professionals')}>
            <Users className="h-4 w-4 mr-2" />
            Encontrar Profissionais
          </Button>
        </div>

        {/* My Projects */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meus Projetos</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : projects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum projeto criado
                </h3>
                <p className="text-gray-500 mb-4">
                  Comece criando seu primeiro projeto ambiental.
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
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {project.services?.name}
                        </CardDescription>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {project.description.length > 150 
                        ? `${project.description.substring(0, 150)}...` 
                        : project.description
                      }
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {(project.budget_min || project.budget_max) && (
                          <span className="text-green-600 font-medium">
                            {project.budget_min && project.budget_max 
                              ? `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`
                              : formatCurrency(project.budget_min || project.budget_max)
                            }
                          </span>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Projeto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
