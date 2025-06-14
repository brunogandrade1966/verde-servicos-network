
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Users, Briefcase, FileText, Star, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Stats {
  totalUsers: number;
  totalClients: number;
  totalProfessionals: number;
  totalProjects: number;
  totalApplications: number;
  totalPartnerships: number;
}

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalClients: 0,
    totalProfessionals: 0,
    totalProjects: 0,
    totalApplications: 0,
    totalPartnerships: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch user stats
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('user_type');

      if (usersError) {
        toast({
          title: "Erro ao carregar estatísticas de usuários",
          description: usersError.message,
          variant: "destructive"
        });
      }

      // Fetch projects count
      const { count: projectsCount, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (projectsError) {
        toast({
          title: "Erro ao carregar estatísticas de projetos",
          description: projectsError.message,
          variant: "destructive"
        });
      }

      // Fetch applications count
      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      if (applicationsError) {
        toast({
          title: "Erro ao carregar estatísticas de candidaturas",
          description: applicationsError.message,
          variant: "destructive"
        });
      }

      // Fetch partnerships count
      const { count: partnershipsCount, error: partnershipsError } = await supabase
        .from('partnerships')
        .select('*', { count: 'exact', head: true });

      if (partnershipsError) {
        toast({
          title: "Erro ao carregar estatísticas de parcerias",
          description: partnershipsError.message,
          variant: "destructive"
        });
      }

      if (usersData) {
        const totalUsers = usersData.length;
        const totalClients = usersData.filter(u => u.user_type === 'client').length;
        const totalProfessionals = usersData.filter(u => u.user_type === 'professional').length;

        setStats({
          totalUsers,
          totalClients,
          totalProfessionals,
          totalProjects: projectsCount || 0,
          totalApplications: applicationsCount || 0,
          totalPartnerships: partnershipsCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
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
                <p className="text-sm text-gray-500">Painel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Administrador</Badge>
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
        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visão Geral da Plataforma</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription>Total de Usuários</CardDescription>
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-blue-600">
                    {stats.totalUsers}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    {stats.totalClients} clientes • {stats.totalProfessionals} profissionais
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription>Projetos na Plataforma</CardDescription>
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-green-600">
                    {stats.totalProjects}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    Projetos cadastrados por clientes
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription>Candidaturas Enviadas</CardDescription>
                    <Briefcase className="h-4 w-4 text-orange-600" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-orange-600">
                    {stats.totalApplications}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    Candidaturas de profissionais
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription>Parcerias Formadas</CardDescription>
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-purple-600">
                    {stats.totalPartnerships}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    Colaborações entre profissionais
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription>Taxa de Engajamento</CardDescription>
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-yellow-600">
                    {stats.totalProjects > 0 ? Math.round((stats.totalApplications / stats.totalProjects) * 100) / 100 : 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    Candidaturas por projeto
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription>Crescimento</CardDescription>
                    <Leaf className="h-4 w-4 text-green-600" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-green-600">
                    +{stats.totalUsers}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    Novos usuários cadastrados
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center space-y-2"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="h-6 w-6" />
              <span>Gerenciar Usuários</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center space-y-2"
              onClick={() => navigate('/admin/projects')}
            >
              <FileText className="h-6 w-6" />
              <span>Gerenciar Projetos</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center space-y-2"
              onClick={() => navigate('/admin/services')}
            >
              <Briefcase className="h-6 w-6" />
              <span>Gerenciar Serviços</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center space-y-2"
              onClick={() => navigate('/admin/reports')}
            >
              <Star className="h-6 w-6" />
              <span>Relatórios</span>
            </Button>
          </div>
        </div>

        {/* System Health */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Status do Sistema</h3>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Sistema Operacional</span>
                </div>
                <div className="text-sm text-gray-500">
                  Última atualização: {new Date().toLocaleString('pt-BR')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
