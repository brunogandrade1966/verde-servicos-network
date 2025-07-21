import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  Users,
  Settings,
  DollarSign,
  Package,
  Upload,
  Shield,
  Database,
  UserCheck,
  TrendingUp,
  Activity,
  MessageSquare,
  FileText,
  Star,
  Briefcase
} from 'lucide-react';

const AdminSidebarContent = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-red-100 text-red-700 font-medium" : "hover:bg-gray-100";

  const dashboardItems = [
    { title: "Dashboard", url: "/admin", icon: BarChart3 },
    { title: "Estatísticas", url: "/admin/stats", icon: TrendingUp },
    { title: "Atividades", url: "/admin/activity", icon: Activity },
  ];

  const userManagementItems = [
    { title: "Usuários", url: "/admin/users", icon: Users },
    { title: "Perfis", url: "/admin/profiles", icon: UserCheck },
    { title: "Permissões", url: "/admin/permissions", icon: Shield },
  ];

  const contentManagementItems = [
    { title: "Serviços", url: "/admin/services", icon: Settings },
    { title: "Importar Serviços", url: "/admin/import-services", icon: Upload },
    { title: "Projetos", url: "/admin/projects", icon: FileText },
    { title: "Parcerias", url: "/admin/partnerships", icon: Briefcase },
  ];

  const businessItems = [
    { title: "Planos", url: "/admin/plans", icon: DollarSign },
    { title: "Assinantes", url: "/admin/subscribers", icon: Package },
    { title: "Avaliações", url: "/admin/reviews", icon: Star },
  ];

  const systemItems = [
    { title: "Mensagens", url: "/admin/messages", icon: MessageSquare },
    { title: "Banco de Dados", url: "/admin/database", icon: Database },
    { title: "Configurações", url: "/admin/settings", icon: Settings },
  ];

  const menuGroups = [
    { label: "Dashboard", items: dashboardItems },
    { label: "Gestão de Usuários", items: userManagementItems },
    { label: "Gestão de Conteúdo", items: contentManagementItems },
    { label: "Negócios", items: businessItems },
    { label: "Sistema", items: systemItems },
  ];

  return (
    <SidebarContent className="px-2">
      {menuGroups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel className="text-gray-500 text-xs font-medium uppercase tracking-wider">
            {group.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
};

export default AdminSidebarContent;