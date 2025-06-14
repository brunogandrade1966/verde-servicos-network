
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUnreadMessages = () => {
  const { profile } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .is('read_at', null)
        .neq('sender_id', profile.id);

      if (error) {
        console.error('Error fetching unread count:', error);
        return;
      }

      setUnreadCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!profile?.id) return;

    fetchUnreadCount();

    const channel = supabase
      .channel('unread-messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as any;
          // If the message is not from the current user and not read
          if (newMessage.sender_id !== profile.id && !newMessage.read_at) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const updatedMessage = payload.new as any;
          const oldMessage = payload.old as any;
          
          // If message was marked as read and it wasn't from current user
          if (
            !oldMessage.read_at && 
            updatedMessage.read_at && 
            updatedMessage.sender_id !== profile.id
          ) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  return {
    unreadCount,
    loading,
    refreshUnreadCount: fetchUnreadCount
  };
};
