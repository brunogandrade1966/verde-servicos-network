
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MessageCircle, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ActiveProject {
  id: string;
  title: string;
  status: string;
  deadline?: string;
  client: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

interface ActiveProjectsProps {
  projects: ActiveProject[];
  loading: boolean;
}

const ActiveProjects = ({ projects, loading }: ActiveProjectsProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { createConversation } = useConversations(profile?.id);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const handleStartConversation = async (clientId: string, clientName: string) => {
    if (!profile?.id) return;

    try {
      const conversation = await createConversation(clientId, profile.id);
      if (conversation) {
        navigate('/messages');
        toast({
          title: "Conversa iniciada!",
          description: `Você pode agora trocar mensagens com ${clientName}.`
        });
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projetos em Andamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Projetos em Andamento</span>
          <Badge variant="secondary">{projects.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum projeto em andamento
          </p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900 line-clamp-1">
                    {project.title}
                  </h4>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={project.client.avatar_url} />
                    <AvatarFallback>
                      {project.client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {project.client.name}
                    </p>
                    <p className="text-xs text-gray-500">Cliente</p>
                  </div>
                </div>

                {project.deadline && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStartConversation(project.client.id, project.client.name)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Conversar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveProjects;
