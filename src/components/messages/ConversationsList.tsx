
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Handshake, User } from 'lucide-react';

interface Conversation {
  id: string;
  client_id: string;
  professional_id: string;
  created_at: string;
  updated_at: string;
  partnership_demand_id?: string;
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
  partnership_demands?: {
    title: string;
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

  const isPartnershipConversation = (conversation: Conversation) => {
    return !!conversation.partnership_demand_id;
  };

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation);
        const initials = otherParticipant?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
        const isSelected = selectedConversationId === conversation.id;
        const isPartnership = isPartnershipConversation(conversation);

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
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={otherParticipant?.avatar_url} alt={otherParticipant?.name} />
                    <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                  </Avatar>
                  {isPartnership && (
                    <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1">
                      <Handshake className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {!isPartnership && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{otherParticipant?.name}</h4>
                    {isPartnership && (
                      <Badge variant="outline" className="text-xs">
                        Parceria
                      </Badge>
                    )}
                  </div>
                  {isPartnership && conversation.partnership_demands?.title && (
                    <p className="text-xs text-orange-600 truncate">
                      {conversation.partnership_demands.title}
                    </p>
                  )}
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
