
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play, Pause, XCircle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  showIcon?: boolean;
}

const ProjectStatusBadge = ({ status, showIcon = true }: ProjectStatusBadgeProps) => {
  const getStatusConfig = (status: ProjectStatus) => {
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
      }
    };
    
    return statusMap[status] || statusMap.draft;
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
