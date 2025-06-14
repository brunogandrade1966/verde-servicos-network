
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChannelManager } from './useChannelManager';

export const useUnreadMessages = () => {
  const { profile } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { createChannel, removeChannel, cleanup } = useChannelManager();

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

  useEffect(() => {
    if (!profile?.id) return;

    fetchUnreadCount();

    const channelName = `unread-messages-${profile.id}`;
    
    const channel = createChannel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as any;
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
          
          if (
            !oldMessage.read_at && 
            updatedMessage.read_at && 
            updatedMessage.sender_id !== profile.id
          ) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe((status) => {
        console.log('Unread messages subscription status:', status);
      });

    return () => {
      removeChannel(channelName);
    };
  }, [profile?.id]);

  return {
    unreadCount,
    loading,
    refreshUnreadCount: fetchUnreadCount
  };
};
