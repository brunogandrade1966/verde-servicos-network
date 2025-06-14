
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUnreadMessages = () => {
  const { profile } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const profileIdRef = useRef<string | null>(null);

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

  const cleanupSubscription = async () => {
    if (channelRef.current && isSubscribedRef.current) {
      try {
        await supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error('Error removing channel:', error);
      }
      channelRef.current = null;
      isSubscribedRef.current = false;
    }
  };

  useEffect(() => {
    if (!profile?.id) return;

    // If the profile ID changed, clean up the old subscription
    if (profileIdRef.current && profileIdRef.current !== profile.id) {
      cleanupSubscription();
    }
    
    profileIdRef.current = profile.id;

    // If already subscribed for this profile, don't subscribe again
    if (isSubscribedRef.current && channelRef.current) {
      fetchUnreadCount();
      return;
    }

    fetchUnreadCount();

    // Clean up any existing subscription
    cleanupSubscription();

    // Create new subscription
    const channel = supabase
      .channel(`unread-messages-${profile.id}-${Date.now()}`)
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
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        } else if (status === 'CLOSED') {
          isSubscribedRef.current = false;
        }
      });

    channelRef.current = channel;

    return () => {
      cleanupSubscription();
    };
  }, [profile?.id]);

  return {
    unreadCount,
    loading,
    refreshUnreadCount: fetchUnreadCount
  };
};
