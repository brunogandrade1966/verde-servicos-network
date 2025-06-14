
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, User } from 'lucide-react';

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

interface ProjectInfoProps {
  project: Project;
}

const ProjectInfo = ({ project }: ProjectInfoProps) => {
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

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
            <div className="flex items-center space-x-4 mb-4">
              {getStatusBadge(project.status)}
              <Badge variant="outline">{project.services?.name}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(project.budget_min || project.budget_max) && (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Orçamento:</span>
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
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Prazo:</span>
                <span className="text-sm">
                  {new Date(project.deadline).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}

            {project.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Localização:</span>
                <span className="text-sm">{project.location}</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Cliente:</span>
              <span className="text-sm">{project.profiles?.name}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;
