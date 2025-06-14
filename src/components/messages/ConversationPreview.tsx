
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConversationPreviewProps {
  conversation: {
    id: string;
    client_id: string;
    professional_id: string;
    updated_at: string;
    client_profile?: {
      name: string;
      avatar_url?: string;
    };
    professional_profile?: {
      name: string;
      avatar_url?: string;
    };
    last_message?: {
      content: string;
      created_at: string;
      sender_id: string;
    };
    unread_count?: number;
  };
  currentUserId: string;
  onClick: () => void;
}

const ConversationPreview = ({ conversation, currentUserId, onClick }: ConversationPreviewProps) => {
  const isClient = currentUserId === conversation.client_id;
  const otherUser = isClient ? conversation.professional_profile : conversation.client_profile;
  const otherUserType = isClient ? 'Profissional' : 'Cliente';
  
  const initials = otherUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  
  const lastMessageTime = conversation.last_message?.created_at 
    ? formatDistanceToNow(new Date(conversation.last_message.created_at), { 
        addSuffix: true, 
        locale: ptBR 
      })
    : formatDistanceToNow(new Date(conversation.updated_at), { 
        addSuffix: true, 
        locale: ptBR 
      });

  const isLastMessageFromOther = conversation.last_message?.sender_id !== currentUserId;
  const hasUnreadMessages = (conversation.unread_count || 0) > 0;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        hasUnreadMessages ? 'border-blue-500 bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={otherUser?.avatar_url} alt={otherUser?.name} />
            <AvatarFallback className="bg-gray-100 text-gray-600">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium truncate ${hasUnreadMessages ? 'text-blue-900' : 'text-gray-900'}`}>
                {otherUser?.name || 'Usuário'}
              </h3>
              <div className="flex items-center space-x-2">
                {hasUnreadMessages && (
                  <Badge variant="default" className="bg-blue-600 text-white text-xs">
                    {conversation.unread_count}
                  </Badge>
                )}
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {lastMessageTime}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 mb-1">{otherUserType}</p>
            </div>
            
            {conversation.last_message ? (
              <p className={`text-sm truncate ${
                hasUnreadMessages && isLastMessageFromOther 
                  ? 'text-blue-800 font-medium' 
                  : 'text-gray-600'
              }`}>
                {isLastMessageFromOther ? '' : 'Você: '}
                {conversation.last_message.content}
              </p>
            ) : (
              <p className="text-sm text-gray-400 flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                Conversa iniciada
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationPreview;
