
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  location?: string;
  deadline?: string;
  budget_min?: number;
  budget_max?: number;
  created_at: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
  };
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const formatCurrency = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatBudget = () => {
    if (project.budget_min && project.budget_max) {
      return `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`;
    } else if (project.budget_min) {
      return `A partir de ${formatCurrency(project.budget_min)}`;
    } else if (project.budget_max) {
      return `Até ${formatCurrency(project.budget_max)}`;
    }
    return 'Orçamento a combinar';
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary">{project.services.category}</Badge>
          <span className="text-sm text-gray-500">
            {new Date(project.created_at).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <CardTitle className="line-clamp-2">{project.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {project.profiles.name}
          </div>
          
          {project.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {project.location}
            </div>
          )}
          
          {project.deadline && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}
            </div>
          )}
          
          <div className="flex items-center text-sm text-green-600 font-medium">
            <DollarSign className="h-4 w-4 mr-2" />
            {formatBudget()}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            Ver Detalhes
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => navigate(`/projects/${project.id}/apply`)}
          >
            Candidatar-se
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
