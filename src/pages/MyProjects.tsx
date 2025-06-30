
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
  type: 'project' | 'partnership';
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
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchMyProjects();
  }, [profile]);

  const fetchMyProjects = async () => {
    if (!profile?.id) return;

    try {
      // Buscar projetos
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          services(name, category)
        `)
        .eq('client_id', profile.id)
        .in('status', ['in_progress', 'completed'])
        .order('updated_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
      }

      // Buscar demandas de parceria
      const { data: partnershipsData, error: partnershipsError } = await supabase
        .from('partnership_demands')
        .select(`
          *,
          services(name, category)
        `)
        .eq('professional_id', profile.id)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false });

      if (partnershipsError) {
        console.error('Error fetching partnerships:', partnershipsError);
      }

      // Combinar e transformar os dados
      const allProjects: MyProject[] = [];

      // Adicionar projetos
      if (projectsData) {
        for (const project of projectsData) {
          const { count } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id);

          allProjects.push({
            ...project,
            type: 'project',
            _count: {
              applications: count || 0
            }
          });
        }
      }

      // Adicionar parcerias
      if (partnershipsData) {
        for (const partnership of partnershipsData) {
          const { count } = await supabase
            .from('partnership_applications')
            .select('*', { count: 'exact', head: true })
            .eq('partnership_demand_id', partnership.id);

          allProjects.push({
            ...partnership,
            type: 'partnership',
            _count: {
              applications: count || 0
            }
          });
        }
      }

      // Ordenar por data de atualização
      allProjects.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      setProjects(allProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Ocorreu um erro ao carregar seus projetos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
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
      in_progress: projects.filter(p => p.status === 'in_progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      projects: projects.filter(p => p.type === 'project').length,
      partnerships: projects.filter(p => p.type === 'partnership').length,
    };
    return stats;
  };

  const handleViewDetails = (project: MyProject) => {
    if (project.type === 'project') {
      navigate(`/projects/${project.id}`);
    } else {
      navigate(`/partnerships/${project.id}`);
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

  const stats = getStatusStats();

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Meus Projetos</h1>
          <p className="text-gray-600">Projetos e parcerias em andamento e finalizados</p>
        </div>

        {/* Header com estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
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
              <div className="text-2xl font-bold text-blue-600">{stats.projects}</div>
              <div className="text-sm text-gray-500">Projetos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.partnerships}</div>
              <div className="text-sm text-gray-500">Parcerias</div>
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
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="project">Projetos</SelectItem>
                <SelectItem value="partnership">Parcerias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de projetos */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {projects.length === 0 ? 'Nenhum projeto ou parceria encontrado' : 'Nenhum resultado encontrado'}
              </h3>
              <p className="text-gray-500 mb-4">
                {projects.length === 0 
                  ? 'Seus projetos e parcerias aparecerão aqui quando forem aceitos'
                  : 'Tente ajustar os filtros para encontrar seus projetos'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={`${project.type}-${project.id}`} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {project.title}
                    </CardTitle>
                    <div className="flex flex-col items-end gap-1">
                      <ProjectStatusBadge status={project.status} />
                      <Badge variant="outline" className="text-xs">
                        {project.type === 'project' ? 'Projeto' : 'Parceria'}
                      </Badge>
                    </div>
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
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    <p>Atualizado em: {new Date(project.updated_at).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <Button 
                    onClick={() => handleViewDetails(project)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Ver Detalhes
                  </Button>
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
