
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ClientSidebarFooter = () => {
  const { profile, signOut } = useAuth();

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SidebarFooter className="p-4 border-t border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
          <AvatarFallback className="bg-green-100 text-green-600 text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {profile?.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {profile?.email}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="w-full justify-start text-sm"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </SidebarFooter>
  );
};

export default ClientSidebarFooter;
