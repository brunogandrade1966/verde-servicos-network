
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Leaf, Settings, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  profileName?: string;
  profileAvatar?: string;
  onSignOut: () => void;
}

const AdminHeader = ({ profileName, profileAvatar, onSignOut }: AdminHeaderProps) => {
  const initials = profileName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ambiental Partners</h1>
              <p className="text-sm text-gray-500">Painel Administrativo</p>
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
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
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

export default AdminHeader;
