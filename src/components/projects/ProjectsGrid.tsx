
import { Card, CardContent } from '@/components/ui/card';
import ProjectCard from './ProjectCard';

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
    category: string;
  };
  profiles: {
    name: string;
  };
}

interface ProjectsGridProps {
  projects: Project[];
  loading: boolean;
}

const ProjectsGrid = ({ projects, loading }: ProjectsGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Tente ajustar os filtros de busca ou aguarde novos projetos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsGrid;
