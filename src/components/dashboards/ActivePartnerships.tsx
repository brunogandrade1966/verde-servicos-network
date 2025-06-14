
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MessageCircle, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ActivePartnership {
  id: string;
  title: string;
  status: string;
  deadline?: string;
  creator: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

interface ActivePartnershipsProps {
  partnerships: ActivePartnership[];
  loading: boolean;
}

const ActivePartnerships = ({ partnerships, loading }: ActivePartnershipsProps) => {
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
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const handleStartConversation = async (creatorId: string, creatorName: string, partnershipId: string) => {
    if (!profile?.id) return;

    try {
      const conversation = await createConversation(creatorId, profile.id, partnershipId);
      if (conversation) {
        navigate('/messages');
        toast({
          title: "Conversa iniciada!",
          description: `Você pode agora trocar mensagens com ${creatorName}.`
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
          <CardTitle>Parcerias em Andamento</CardTitle>
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
          <span>Parcerias em Andamento</span>
          <Badge variant="secondary">{partnerships.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {partnerships.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhuma parceria em andamento
          </p>
        ) : (
          <div className="space-y-4">
            {partnerships.map((partnership) => (
              <div key={partnership.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900 line-clamp-1">
                    {partnership.title}
                  </h4>
                  <Badge className={getStatusColor(partnership.status)}>
                    {getStatusText(partnership.status)}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={partnership.creator.avatar_url} />
                    <AvatarFallback>
                      {partnership.creator.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {partnership.creator.name}
                    </p>
                    <p className="text-xs text-gray-500">Criador da Parceria</p>
                  </div>
                </div>

                {partnership.deadline && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>Prazo: {new Date(partnership.deadline).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/partnerships/${partnership.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStartConversation(partnership.creator.id, partnership.creator.name, partnership.id)}
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

export default ActivePartnerships;
