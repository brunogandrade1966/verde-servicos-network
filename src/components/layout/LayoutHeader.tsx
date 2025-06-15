
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useMenuItems } from '@/hooks/useMenuItems';

const LayoutHeader = () => {
  const location = useLocation();
  const menuItems = useMenuItems();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="lg:hidden" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {menuItems.find(item => isActive(item.path))?.title || 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-500">
              {menuItems.find(item => isActive(item.path))?.description || 'Bem-vindo ao seu painel'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LayoutHeader;
