
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/types/dashboard';

interface RecentProjectsProps {
  projects: Project[];
  loading: boolean;
}

const RecentProjects = ({ projects, loading }: RecentProjectsProps) => {
  const navigate = useNavigate();

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Demandas Recentes</h2>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Demandas Recentes</h2>
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma demanda disponível
            </h3>
            <p className="text-gray-500">
              Não há demandas abertas no momento.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Demandas Recentes</h2>
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
                  Ver Demanda
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
