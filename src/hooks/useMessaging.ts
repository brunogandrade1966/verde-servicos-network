
import { useEffect } from 'react';
import { useFetchMessages } from './useFetchMessages';
import { useSendMessage } from './useSendMessage';
import { useMessageReadStatus } from './useMessageReadStatus';
import { useMessageSubscription } from './useMessageSubscription';

export const useMessaging = (conversationId?: string) => {
  const { messages, setMessages, loading, fetchMessages } = useFetchMessages();
  const { sendMessage } = useSendMessage();
  const { markAsRead, markConversationAsRead } = useMessageReadStatus();

  const handleNewMessage = (message: any) => {
    setMessages(prev => [...prev, message]);
  };

  const handleMessageUpdate = (updatedMessage: any) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === updatedMessage.id 
          ? { ...msg, ...updatedMessage }
          : msg
      )
    );
  };

  useMessageSubscription({
    conversationId,
    onNewMessage: handleNewMessage,
    onMessageUpdate: handleMessageUpdate,
    onMarkAsRead: markAsRead
  });

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    sendMessage: (content: string) => sendMessage(conversationId!, content),
    markAsRead,
    markConversationAsRead: () => markConversationAsRead(conversationId!),
    fetchMessages: () => fetchMessages(conversationId!)
  };
};
