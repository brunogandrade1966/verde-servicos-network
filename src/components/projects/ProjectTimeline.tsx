
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, Play, Pause, XCircle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

interface TimelineEvent {
  status: ProjectStatus;
  date: string;
  note?: string;
}

interface ProjectTimelineProps {
  events: TimelineEvent[];
  currentStatus: ProjectStatus;
}

const ProjectTimeline = ({ events, currentStatus }: ProjectTimelineProps) => {
  const getStatusIcon = (status: ProjectStatus) => {
    const iconMap = {
      draft: Pause,
      open: Clock,
      in_progress: Play,
      completed: CheckCircle,
      cancelled: XCircle
    };
    
    return iconMap[status] || Clock;
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const labelMap = {
      draft: 'Rascunho',
      open: 'Aberto',
      in_progress: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    
    return labelMap[status] || status;
  };

  const getStatusColor = (status: ProjectStatus) => {
    const colorMap = {
      draft: 'text-gray-500',
      open: 'text-blue-500',
      in_progress: 'text-yellow-500',
      completed: 'text-green-500',
      cancelled: 'text-red-500'
    };
    
    return colorMap[status] || 'text-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline do Projeto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => {
            const Icon = getStatusIcon(event.status);
            const isLast = index === events.length - 1;
            const isCurrent = event.status === currentStatus;
            
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2
                    ${isCurrent ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300'}
                  `}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {!isLast && (
                    <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium ${getStatusColor(event.status)}`}>
                      {getStatusLabel(event.status)}
                    </h4>
                    {isCurrent && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Atual
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {event.note && (
                    <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
