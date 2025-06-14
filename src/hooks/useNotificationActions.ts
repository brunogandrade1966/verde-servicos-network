
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/types/notifications';

export const useNotificationActions = (
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>
) => {
  const { profile } = useAuth();

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!profile?.id) return;

    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ read: true })
        .eq('user_id', profile.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const createNotification = async (
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data?: any
  ) => {
    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data,
          read: false
        });

      if (error) {
        console.error('Error creating notification:', error);
        return;
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return {
    markAsRead,
    markAllAsRead,
    createNotification
  };
};
