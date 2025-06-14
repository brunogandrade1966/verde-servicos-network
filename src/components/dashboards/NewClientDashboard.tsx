
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Star,
  TrendingUp
} from 'lucide-react';

interface DashboardStats {
  activeProjects: number;
  pendingDemands: number;
  totalDemands: number;
  completedProjects: number;
  pendingApplications: number;
  averageRating: number;
}

interface RecentProject {
  id: string;
  title: string;
  status: string;
  created_at: string;
  services: {
    name: string;
  };
}

const NewClientDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    pendingDemands: 0,
    totalDemands: 0,
    completedProjects: 0,
    pendingApplications: 0,
    averageRating: 0
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, [profile?.id]);

  const fetchDashboardData = async () => {
    if (!profile?.id) return;

    try {
      // Buscar estatísticas dos projetos
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          services(name)
        `)
        .eq('client_id', profile.id);

      if (projectsError) throw projectsError;

      // Buscar candidaturas
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          projects!inner(client_id)
        `)
        .eq('projects.client_id', profile.id)
        .eq('status', 'pending');

      if (applicationsError) throw applicationsError;

      // Buscar avaliações
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewer_id', profile.id);

      if (reviewsError) throw reviewsError;

      // Calcular estatísticas
      const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0;
      const pendingDemands = projects?.filter(p => p.status === 'open').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
      const averageRating = reviews?.length > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
        : 0;

      setStats({
        activeProjects,
        pendingDemands,
        totalDemands: projects?.length || 0,
        completedProjects,
        pendingApplications: applications?.length || 0,
        averageRating
      });

      // Projetos recentes (últimos 5)
      const recent = projects
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5) || [];
      
      setRecentProjects(recent);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações do dashboard.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Aberto</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Em Andamento</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Concluído</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Rascunho</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Boas-vindas */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo, {profile?.name}!</h2>
        <p className="text-green-100">
          Gerencie seus projetos ambientais e encontre os melhores profissionais
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Projetos Ativos
              </CardTitle>
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.activeProjects}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Demandas Pendentes
              </CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingDemands}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Aguardando candidaturas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Candidaturas
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.pendingApplications}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Para revisar
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avaliação Média
              </CardTitle>
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              De 5 estrelas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Principais ações que você pode realizar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/create-project')} 
              className="bg-green-600 hover:bg-green-700 h-auto py-4"
            >
              <div className="flex flex-col items-center space-y-2">
                <PlusCircle className="h-6 w-6" />
                <span>Criar Nova Demanda</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/professionals')}
              className="h-auto py-4 border-green-200 hover:bg-green-50"
            >
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-6 w-6 text-green-600" />
                <span>Buscar Profissionais</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/applications')}
              className="h-auto py-4 border-green-200 hover:bg-green-50"
            >
              <div className="flex flex-col items-center space-y-2">
                <FileText className="h-6 w-6 text-green-600" />
                <span>Ver Candidaturas</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projetos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Atividade Recente
          </CardTitle>
          <CardDescription>
            Seus projetos mais recentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{project.title}</h4>
                    <p className="text-sm text-gray-500">{project.services?.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(project.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum projeto encontrado</p>
              <Button 
                onClick={() => navigate('/create-project')} 
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Criar Primeira Demanda
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewClientDashboard;
