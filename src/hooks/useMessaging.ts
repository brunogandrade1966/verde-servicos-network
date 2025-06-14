
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
  sender?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export const useMessaging = (conversationId?: string) => {
  const { profile } = useAuth();
  const { createNotification } = useNotifications();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<any>(null);

  const fetchMessages = async () => {
    if (!conversationId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            id,
            name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
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

  const markConversationAsRead = async () => {
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

  useEffect(() => {
    if (!conversationId) return;

    fetchMessages();

    // Clean up any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`messages-${conversationId}-${Date.now()}`)
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

          setMessages(prev => [...prev, messageWithSender]);

          if (newMessage.sender_id !== profile?.id) {
            setTimeout(() => markAsRead(newMessage.id), 1000);
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
          const updatedMessage = payload.new;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === updatedMessage.id 
                ? { ...msg, ...updatedMessage }
                : msg
            )
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, profile?.id]);

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    markConversationAsRead,
    fetchMessages
  };
};
