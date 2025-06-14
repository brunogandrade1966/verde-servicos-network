
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useMessageReadStatus = () => {
  const { profile } = useAuth();

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .is('read_at', null);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markConversationAsRead = async (conversationId: string) => {
    if (!conversationId || !profile?.id) return;

    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', profile.id)
        .is('read_at', null);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  return {
    markAsRead,
    markConversationAsRead
  };
};
