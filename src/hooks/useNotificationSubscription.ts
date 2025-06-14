
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useChannelManager } from './useChannelManager';
import { Notification } from '@/types/notifications';

interface UseNotificationSubscriptionProps {
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

export const useNotificationSubscription = ({
  setNotifications,
  setUnreadCount
}: UseNotificationSubscriptionProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { createChannel, removeChannel } = useChannelManager();

  useEffect(() => {
    if (!profile?.id) return;

    const channelName = `notifications-${profile.id}`;
    
    const channel = createChannel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);

          toast({
            title: newNotification.title,
            description: newNotification.message,
            duration: 5000
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
        }
      )
      .subscribe((status) => {
        console.log('Notifications subscription status:', status);
      });

    return () => {
      removeChannel(channelName);
    };
  }, [profile?.id, toast, createChannel, removeChannel, setNotifications, setUnreadCount]);
};
