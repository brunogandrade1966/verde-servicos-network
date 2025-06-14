
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  profileName?: string;
  onSignOut: () => void;
}

const AdminHeader = ({ profileName, onSignOut }: AdminHeaderProps) => {
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
            <Badge variant="secondary">Administrador</Badge>
            <span className="text-sm text-gray-700">Olá, {profileName}</span>
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
