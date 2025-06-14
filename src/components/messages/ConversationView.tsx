
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';

interface ConversationViewProps {
  conversationId: string;
  currentUserId: string;
  onBack: () => void;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  read_at?: string;
}

interface ConversationData {
  id: string;
  client_id: string;
  professional_id: string;
  client_profile: {
    name: string;
    avatar_url?: string;
  };
  professional_profile: {
    name: string;
    avatar_url?: string;
  };
}

const ConversationView = ({ conversationId, currentUserId, onBack }: ConversationViewProps) => {
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversation();
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    markMessagesAsRead();
  }, [messages, currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          client_id,
          professional_id,
          client_profile:profiles!conversations_client_id_fkey(name, avatar_url),
          professional_profile:profiles!conversations_professional_id_fkey(name, avatar_url)
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      setConversation(data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast({
        title: "Erro ao carregar conversa",
        description: "Não foi possível carregar os dados da conversa.",
        variant: "destructive"
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Erro ao carregar mensagens",
        description: "Não foi possível carregar as mensagens.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      const unreadMessages = messages.filter(
        msg => msg.sender_id !== currentUserId && !msg.read_at
      );

      if (unreadMessages.length > 0) {
        const { error } = await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .in('id', unreadMessages.map(msg => msg.id));

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!conversation) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      
      toast({
        title: "Mensagem enviada!",
        description: "Sua mensagem foi enviada com sucesso."
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!conversation) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-gray-500">Conversa não encontrada</p>
        </CardContent>
      </Card>
    );
  }

  const isClient = currentUserId === conversation.client_id;
  const otherUser = isClient ? conversation.professional_profile : conversation.client_profile;
  const otherUserType = isClient ? 'Profissional' : 'Cliente';
  const otherInitials = otherUser.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const getMessageSender = (senderId: string) => {
    if (senderId === conversation.client_id) {
      return conversation.client_profile;
    }
    return conversation.professional_profile;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b bg-gray-50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherUser.avatar_url} alt={otherUser.name} />
            <AvatarFallback>{otherInitials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
            <p className="text-sm text-gray-600">{otherUserType}</p>
          </div>
          
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4" style={{ maxHeight: '60vh' }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Nenhuma mensagem ainda. Comece a conversa!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                senderProfile={getMessageSender(message.sender_id)}
                isCurrentUser={message.sender_id === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>

      <MessageComposer onSendMessage={sendMessage} disabled={sending} />
    </Card>
  );
};

export default ConversationView;
