
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline">{project.services?.name}</Badge>
              <span className="text-sm text-gray-500">
                Por {project.profiles?.name}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">
          {project.description.length > 150 
            ? `${project.description.substring(0, 150)}...` 
            : project.description
          }
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {(project.budget_min || project.budget_max) && (
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm">
                {project.budget_min && project.budget_max 
                  ? `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`
                  : formatCurrency(project.budget_min || project.budget_max)
                }
              </span>
            </div>
          )}

          {project.deadline && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                {new Date(project.deadline).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}

          {project.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-orange-600" />
              <span className="text-sm">{project.location}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-purple-600" />
            <span className="text-sm">
              {new Date(project.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            Ver Detalhes
          </Button>
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
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
