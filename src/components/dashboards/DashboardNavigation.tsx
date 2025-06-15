
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { 
  Home, 
  Search, 
  PlusCircle, 
  MessageCircle, 
  User, 
  Briefcase,
  Users,
  FileText,
  Settings,
  Handshake
} from 'lucide-react';

const DashboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { unreadCount } = useUnreadMessages();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Dashboard',
      show: true
    },
    {
      path: '/projects',
      icon: Search,
      label: 'Explorar Demandas',
      show: profile?.user_type === 'professional'
    },
    {
      path: '/create-project',
      icon: PlusCircle,
      label: 'Criar Demanda',
      show: profile?.user_type === 'client'
    },
    {
      path: '/professionals',
      icon: Users,
      label: 'Buscar Profissionais',
      show: profile?.user_type === 'client'
    },
    {
      path: '/partnerships',
      icon: Briefcase,
      label: 'Parcerias',
      show: profile?.user_type === 'professional'
    },
    {
      path: '/my-partnership-requests',
      icon: Handshake,
      label: 'Solicitar Parcerias',
      show: profile?.user_type === 'professional'
    },
    {
      path: '/contracted-projects',
      icon: FileText,
      label: 'Projetos Contratados',
      show: true
    },
    {
      path: '/messages',
      icon: MessageCircle,
      label: 'Mensagens',
      show: true,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      path: '/profile',
      icon: User,
      label: 'Perfil',
      show: true
    }
  ];

  if (profile?.user_type === 'admin') {
    navigationItems.push({
      path: '/admin/services',
      icon: Settings,
      label: 'Gerenciar Serviços',
      show: true
    });
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navigationItems
              .filter(item => item.show)
              .map(({ path, icon: Icon, label, badge }) => (
                <Button
                  key={path}
                  variant={isActive(path) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(path)}
                  className="flex items-center space-x-2 relative"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
                    >
                      {badge > 99 ? '99+' : badge}
                    </Badge>
                  )}
                </Button>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;
