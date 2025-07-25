
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Leaf, Star, LogOut, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import NotificationCenter from '@/components/notifications/NotificationCenter';

interface DashboardHeaderProps {
  profileName?: string;
  profileAvatar?: string;
  onSignOut: () => void;
}

const DashboardHeader = ({ profileName, profileAvatar, onSignOut }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { unreadCount } = useUnreadMessages();
  
  const initials = profileName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ambiental Partners</h1>
              <p className="text-sm text-gray-500">Painel do Profissional</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileAvatar} alt={profileName} />
                <AvatarFallback className="text-sm">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700">Olá, {profileName}</span>
            </div>
            
            <NotificationCenter />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/messages')}
              className="relative"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Mensagens
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              <Star className="h-4 w-4 mr-2" />
              Perfil
            </Button>
            <Button variant="ghost" size="sm" onClick={onSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
