
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ProjectStatusBadge from './ProjectStatusBadge';

interface Project {
  id: string;
  status: string;
  created_at: string;
  client_id: string;
  services: {
    category: string;
  };
}

interface Profile {
  id?: string;
  user_type?: string;
}

interface ProjectSidebarProps {
  project: Project;
  profile: Profile | null;
}

const ProjectSidebar = ({ project, profile }: ProjectSidebarProps) => {
  const navigate = useNavigate();

  const handleEditProject = () => {
    navigate(`/projects/${project.id}/edit`);
  };

  const handleFindProfessionals = () => {
    navigate('/professionals');
  };

  const handleApplyToProject = () => {
    navigate(`/projects/${project.id}/apply`);
  };

  const handleViewContractedProjects = () => {
    navigate('/contracted-projects');
  };

  const isOwner = profile?.id === project.client_id;
  const canEdit = profile?.user_type === 'client' && isOwner;
  const canApply = profile?.user_type === 'professional' && project.status === 'open';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Demanda</CardTitle>
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
              <ProjectStatusBadge status={project.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações para Cliente */}
      {profile?.user_type === 'client' && (
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {canEdit && (
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleEditProject}
              >
                Editar Demanda
              </Button>
            )}
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleFindProfessionals}
            >
              Buscar Profissionais
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleViewContractedProjects}
            >
              Ver Demandas Contratadas
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ações para Profissional */}
      {canApply && (
        <Card>
          <CardHeader>
            <CardTitle>Candidatar-se</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
              onClick={handleApplyToProject}
            >
              Candidatar-se à Demanda
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Envie sua proposta para esta demanda
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navegação para demandas contratadas para profissionais */}
      {profile?.user_type === 'professional' && (
        <Card>
          <CardHeader>
            <CardTitle>Seus Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleViewContractedProjects}
            >
              Ver Projetos Contratados
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectSidebar;
