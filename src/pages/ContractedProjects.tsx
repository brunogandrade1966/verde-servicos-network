import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

interface ContractedProject {
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
  profiles: {
    name: string;
  };
}

const ContractedProjects = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ContractedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractedProjects();
  }, [profile]);

  const fetchContractedProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          services(name, category),
          profiles(name)
        `)
        .in('status', ['in_progress', 'completed'])
        .order('updated_at', { ascending: false });

      // Filtrar baseado no tipo de usuário
      if (profile?.user_type === 'client') {
        query = query.eq('client_id', profile.id);
      } else if (profile?.user_type === 'professional') {
        // Para profissionais, buscar projetos onde eles foram contratados
        // Isso requer uma junção com a tabela applications
        const { data: applications } = await supabase
          .from('applications')
          .select('project_id')
          .eq('professional_id', profile.id)
          .eq('status', 'accepted');

        if (applications && applications.length > 0) {
          const projectIds = applications.map(app => app.project_id);
          query = query.in('id', projectIds);
        } else {
          setProjects([]);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query;

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
      console.error('Error fetching contracted projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`;
    if (min) return `A partir de R$ ${min.toLocaleString()}`;
    if (max) return `Até R$ ${max.toLocaleString()}`;
    return null;
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Demandas Contratadas
              </h1>
              <p className="text-gray-600">
                Acompanhe o progresso dos seus projetos em andamento
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma demanda contratada
              </h3>
              <p className="text-gray-600 mb-4">
                {profile?.user_type === 'client' 
                  ? 'Você ainda não tem projetos em andamento.'
                  : 'Você ainda não foi contratado para nenhuma demanda.'
                }
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Voltar ao Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {project.title}
                    </CardTitle>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{project.services.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {profile?.user_type === 'client' ? 'Projeto seu' : `Cliente: ${project.profiles.name}`}
                  </p>
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
                    
                    {formatBudget(project.budget_min, project.budget_max) && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatBudget(project.budget_min, project.budget_max)}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    <p>Atualizado em: {new Date(project.updated_at).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <Button 
                    onClick={() => handleViewProject(project.id)}
                    className="w-full"
                    variant="outline"
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ContractedProjects;
