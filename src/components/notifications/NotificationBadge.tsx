
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge = ({ className = '' }: NotificationBadgeProps) => {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) return null;

  return (
    <Badge
      variant="destructive"
      className={`h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center ${className}`}
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
};

export default NotificationBadge;
