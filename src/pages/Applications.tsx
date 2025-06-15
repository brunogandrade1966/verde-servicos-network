
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientLayout from '@/components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, DollarSign, Search, Filter, MessageCircle } from 'lucide-react';

interface Application {
  id: string;
  proposed_price?: number;
  proposal: string;
  status: string;
  estimated_duration?: string;
  created_at: string;
  profiles: {
    id: string;
    name: string;
    bio?: string;
    avatar_url?: string;
  };
  projects: {
    id: string;
    title: string;
    status: string;
  };
}

const Applications = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectFilter = searchParams.get('project');
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectIdFilter, setProjectIdFilter] = useState<string>(projectFilter || 'all');

  useEffect(() => {
    fetchApplications();
  }, [profile]);

  const fetchApplications = async () => {
    if (!profile?.id) return;

    try {
      // Primeiro, buscar os projetos do cliente
      const { data: userProjects, error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('client_id', profile.id);

      if (projectsError) {
        toast({
          title: "Erro ao carregar projetos",
          description: projectsError.message,
          variant: "destructive"
        });
        return;
      }

      if (!userProjects || userProjects.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const projectIds = userProjects.map(p => p.id);

      // Buscar candidaturas para os projetos do cliente que não foram aceitas
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles(id, name, bio, avatar_url),
          projects(id, title, status)
        `)
        .in('project_id', projectIds)
        .neq('status', 'accepted') // Excluir candidaturas aceitas
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar candidaturas",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string, professionalName: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (error) {
        console.error('Error accepting application:', error);
        toast({
          title: "Erro ao aceitar candidatura",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Candidatura aceita!",
        description: `A candidatura de ${professionalName} foi aceita.`
      });

      // Recarregar candidaturas
      fetchApplications();
    } catch (error) {
      console.error('Error accepting application:', error);
      toast({
        title: "Erro ao aceitar candidatura",
        description: "Não foi possível aceitar a candidatura. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleRejectApplication = async (applicationId: string, professionalName: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) {
        console.error('Error rejecting application:', error);
        toast({
          title: "Erro ao rejeitar candidatura",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Candidatura rejeitada",
        description: `A candidatura de ${professionalName} foi rejeitada.`
      });

      // Recarregar candidaturas
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Erro ao rejeitar candidatura",
        description: "Não foi possível rejeitar a candidatura. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Filtrar candidaturas
  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.profiles.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.projects.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.proposal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    const matchesProject = projectIdFilter === 'all' || application.projects.id === projectIdFilter;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pendente</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Obter projetos únicos para o filtro
  const uniqueProjects = applications.reduce((acc, app) => {
    if (!acc.find(p => p.id === app.projects.id)) {
      acc.push(app.projects);
    }
    return acc;
  }, [] as { id: string; title: string }[]);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidaturas Recebidas</h1>
          <p className="text-gray-600">Candidaturas de profissionais para suas demandas</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
              <div className="text-sm text-gray-500">Total de Candidaturas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(a => a.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {applications.filter(a => a.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-500">Rejeitadas</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por profissional, projeto ou proposta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="rejected">Rejeitadas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={projectIdFilter} onValueChange={setProjectIdFilter}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os projetos</SelectItem>
              {uniqueProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista de candidaturas */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <User className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {applications.length === 0 ? 'Nenhuma candidatura recebida' : 'Nenhuma candidatura encontrada'}
              </h3>
              <p className="text-gray-500">
                {applications.length === 0 
                  ? 'Quando profissionais se candidatarem às suas demandas, elas aparecerão aqui'
                  : 'Tente ajustar os filtros para encontrar candidaturas'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{application.profiles.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Candidatura para: <span className="font-medium">{application.projects.title}</span>
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(application.status)}
                        <span className="text-sm text-gray-500">
                          {new Date(application.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 mb-4">{application.proposal}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {application.proposed_price && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-green-600 font-medium">
                          {formatCurrency(application.proposed_price)}
                        </span>
                      </div>
                    )}
                    {application.estimated_duration && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Prazo: {application.estimated_duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate(`/professionals/${application.profiles.id}`)}
                      variant="outline" 
                      size="sm"
                    >
                      Ver Perfil
                    </Button>
                    <Button 
                      onClick={() => navigate(`/projects/${application.projects.id}`)}
                      variant="outline" 
                      size="sm"
                    >
                      Ver Projeto
                    </Button>
                    {application.status === 'pending' && (
                      <>
                        <Button 
                          onClick={() => handleAcceptApplication(application.id, application.profiles.name)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Aceitar
                        </Button>
                        <Button 
                          onClick={() => handleRejectApplication(application.id, application.profiles.name)}
                          variant="destructive"
                          size="sm"
                        >
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default Applications;
