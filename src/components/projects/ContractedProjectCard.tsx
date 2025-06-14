
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
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

interface ContractedProjectCardProps {
  project: ContractedProject;
  userType?: string;
}

const ContractedProjectCard = ({ project, userType }: ContractedProjectCardProps) => {
  const navigate = useNavigate();

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

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
          {userType === 'client' ? 'Projeto seu' : `Cliente: ${project.profiles.name}`}
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
  );
};

export default ContractedProjectCard;
