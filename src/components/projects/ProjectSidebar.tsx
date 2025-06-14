
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  status: string;
  created_at: string;
  services: {
    category: string;
  };
}

interface Profile {
  user_type?: string;
}

interface ProjectSidebarProps {
  project: Project;
  profile: Profile | null;
}

const ProjectSidebar = ({ project, profile }: ProjectSidebarProps) => {
  const navigate = useNavigate();

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

  const handleEditProject = () => {
    navigate(`/projects/${project.id}/edit`);
  };

  const handleFindProfessionals = () => {
    navigate('/professionals');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Categoria:</span>
            <p className="text-sm">{project.services?.category}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Criado em:</span>
            <p className="text-sm">
              {new Date(project.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <div className="mt-1">
              {getStatusBadge(project.status)}
            </div>
          </div>
        </CardContent>
      </Card>

      {profile?.user_type === 'client' && (
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleEditProject}
            >
              Editar Demanda
            </Button>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleFindProfessionals}
            >
              Buscar Profissionais
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectSidebar;
