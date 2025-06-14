
import { useEffect } from 'react';
import { useFetchNotifications } from './useFetchNotifications';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationSubscription } from './useNotificationSubscription';

export const useNotifications = () => {
  const {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    loading,
    fetchNotifications
  } = useFetchNotifications();

  const { markAsRead, markAllAsRead, createNotification } = useNotificationActions(
    setNotifications,
    setUnreadCount
  );

  useNotificationSubscription({
    setNotifications,
    setUnreadCount
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    createNotification,
    fetchNotifications
  };
};
