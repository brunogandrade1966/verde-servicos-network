
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    read_at?: string;
  };
  senderProfile: {
    name: string;
    avatar_url?: string;
  };
  isCurrentUser: boolean;
}

const MessageBubble = ({ message, senderProfile, isCurrentUser }: MessageBubbleProps) => {
  const initials = senderProfile.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const timeAgo = formatDistanceToNow(new Date(message.created_at), { 
    addSuffix: true, 
    locale: ptBR 
  });

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={senderProfile.avatar_url} alt={senderProfile.name} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md`}>
        <div className={`rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-gray-500">{timeAgo}</span>
          {isCurrentUser && message.read_at && (
            <span className="text-xs text-green-600">Lida</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
