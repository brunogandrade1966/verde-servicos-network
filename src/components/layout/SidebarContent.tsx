
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useMenuItems } from '@/hooks/useMenuItems';

const ClientSidebarContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = useMenuItems();

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarContent className="p-4">
      <SidebarMenu className="space-y-3">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              isActive={isActive(item.path)}
              className="w-full justify-start px-4 py-3 rounded-lg transition-colors hover:bg-green-50 data-[active=true]:bg-green-100 data-[active=true]:text-green-700 h-auto"
            >
              <button
                onClick={() => navigate(item.path)}
                className="flex items-start space-x-4 w-full text-left"
              >
                <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="text-sm font-medium truncate">{item.title}</div>
                  <div className="text-xs text-gray-500 truncate leading-relaxed">{item.description}</div>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  );
};

export default ClientSidebarContent;
