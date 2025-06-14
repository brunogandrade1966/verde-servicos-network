
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface Conversation {
  id: string;
  client_id: string;
  professional_id: string;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  professional?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
}

const ConversationsList = ({ 
  conversations, 
  selectedConversationId, 
  onConversationSelect 
}: ConversationsListProps) => {
  const { profile } = useAuth();

  const getOtherParticipant = (conversation: Conversation) => {
    if (profile?.id === conversation.client_id) {
      return conversation.professional;
    }
    return conversation.client;
  };

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation);
        const initials = otherParticipant?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
        const isSelected = selectedConversationId === conversation.id;

        return (
          <Card 
            key={conversation.id}
            className={`cursor-pointer transition-colors ${
              isSelected ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => onConversationSelect(conversation.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherParticipant?.avatar_url} alt={otherParticipant?.name} />
                  <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{otherParticipant?.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(conversation.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ConversationsList;
