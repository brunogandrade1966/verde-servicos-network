
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, DollarSign, Users, Search, Filter, Plus } from 'lucide-react';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

interface MyProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  services: {
    name: string;
    category: string;
  };
  _count?: {
    applications: number;
  };
}

const MyProjects = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<MyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchMyProjects();
  }, [profile]);

  const fetchMyProjects = async () => {
    if (!profile?.id) return;

    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          services(name, category)
        `)
        .eq('client_id', profile.id)
        .order('updated_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Erro ao carregar projetos",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Buscar contagem de aplicações para cada projeto
      const projectsWithCounts = await Promise.all(
        (data || []).map(async (project) => {
          const { count } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id);

          return {
            ...project,
            _count: {
              applications: count || 0
            }
          };
        })
      );

      setProjects(projectsWithCounts);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return 'Orçamento a combinar';
    if (min && max) return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`;
    if (min) return `A partir de R$ ${min.toLocaleString()}`;
    if (max) return `Até R$ ${max.toLocaleString()}`;
    return 'Orçamento a combinar';
  };

  const getStatusStats = () => {
    const stats = {
      total: projects.length,
      open: projects.filter(p => p.status === 'open').length,
      in_progress: projects.filter(p => p.status === 'in_progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      cancelled: projects.filter(p => p.status === 'cancelled').length,
    };
    return stats;
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

  const stats = getStatusStats();

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header com estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total de Projetos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
              <div className="text-sm text-gray-500">Abertos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.in_progress}</div>
              <div className="text-sm text-gray-500">Em Andamento</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-500">Concluídos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-sm text-gray-500">Cancelados</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e busca */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="open">Abertos</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => navigate('/services')} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Lista de projetos */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {projects.length === 0 ? 'Nenhum projeto criado ainda' : 'Nenhum projeto encontrado'}
              </h3>
              <p className="text-gray-500 mb-4">
                {projects.length === 0 
                  ? 'Comece criando seu primeiro projeto de serviço ambiental'
                  : 'Tente ajustar os filtros para encontrar seus projetos'
                }
              </p>
              {projects.length === 0 && (
                <Button onClick={() => navigate('/services')} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {project.title}
                    </CardTitle>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{project.services.category}</Badge>
                    <span>•</span>
                    <span>{project.services.name}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {project.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    
                    {project.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Até {new Date(project.deadline).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatBudget(project.budget_min, project.budget_max)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project._count?.applications || 0} candidatura(s)</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    <p>Criado em: {new Date(project.created_at).toLocaleDateString('pt-BR')}</p>
                    <p>Atualizado em: {new Date(project.updated_at).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate(`/projects/${project.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Ver Detalhes
                    </Button>
                    {project._count && project._count.applications > 0 && (
                      <Button 
                        onClick={() => navigate(`/projects/${project.id}#applications`)}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Ver Candidaturas
                      </Button>
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

export default MyProjects;
