
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

export const useSendMessage = () => {
  const { profile } = useAuth();
  const { createNotification } = useNotifications();

  const sendMessage = async (conversationId: string, content: string) => {
    if (!conversationId || !profile?.id) return;

    try {
      const { data: conversation } = await supabase
        .from('conversations')
        .select(`
          client_id,
          professional_id,
          client:profiles!conversations_client_id_fkey(name),
          professional:profiles!conversations_professional_id_fkey(name)
        `)
        .eq('id', conversationId)
        .single();

      if (!conversation) return;

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: profile.id,
          content
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            id,
            name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      const recipientId = profile.id === conversation.client_id 
        ? conversation.professional_id 
        : conversation.client_id;

      const senderName = profile.name || 'Usuário';

      if (recipientId) {
        await createNotification(
          recipientId,
          'message',
          'Nova mensagem',
          `${senderName} enviou uma mensagem: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
          { conversationId, messageId: message.id }
        );
      }

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return { sendMessage };
};
