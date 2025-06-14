
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play, Pause, XCircle } from 'lucide-react';

interface ProjectStatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

const ProjectStatusBadge = ({ status, showIcon = true }: ProjectStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    const statusMap = {
      draft: { 
        label: 'Rascunho', 
        variant: 'secondary' as const, 
        icon: Pause,
        color: 'bg-gray-100 text-gray-800'
      },
      open: { 
        label: 'Aberto', 
        variant: 'default' as const, 
        icon: Clock,
        color: 'bg-blue-100 text-blue-800'
      },
      in_progress: { 
        label: 'Em Andamento', 
        variant: 'outline' as const, 
        icon: Play,
        color: 'bg-yellow-100 text-yellow-800'
      },
      completed: { 
        label: 'Concluído', 
        variant: 'default' as const, 
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800'
      },
      cancelled: { 
        label: 'Cancelado', 
        variant: 'destructive' as const, 
        icon: XCircle,
        color: 'bg-red-100 text-red-800'
      },
      contracted: {
        label: 'Contratado',
        variant: 'default' as const,
        icon: CheckCircle,
        color: 'bg-purple-100 text-purple-800'
      }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.draft;
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.color} flex items-center gap-1`}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
};

export default ProjectStatusBadge;
