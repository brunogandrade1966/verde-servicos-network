
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChannelManager } from './useChannelManager';
import { Message } from '@/types/messaging';

interface UseMessageSubscriptionProps {
  conversationId?: string;
  onNewMessage: (message: Message) => void;
  onMessageUpdate: (message: Message) => void;
  onMarkAsRead: (messageId: string) => void;
}

export const useMessageSubscription = ({
  conversationId,
  onNewMessage,
  onMessageUpdate,
  onMarkAsRead
}: UseMessageSubscriptionProps) => {
  const { profile } = useAuth();
  const { createChannel, removeChannel } = useChannelManager();

  useEffect(() => {
    if (!conversationId) return;

    const channelName = `messages-${conversationId}`;
    
    const channel = createChannel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          const newMessage = payload.new;
          
          const { data: sender } = await supabase
            .from('profiles')
            .select('id, name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          const messageWithSender = {
            ...newMessage,
            sender
          } as Message;

          onNewMessage(messageWithSender);

          if (newMessage.sender_id !== profile?.id) {
            setTimeout(() => onMarkAsRead(newMessage.id), 1000);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          onMessageUpdate(updatedMessage);
        }
      )
      .subscribe((status) => {
        console.log('Messages subscription status:', status);
      });

    return () => {
      removeChannel(channelName);
    };
  }, [conversationId, profile?.id, onNewMessage, onMessageUpdate, onMarkAsRead, createChannel, removeChannel]);
};
