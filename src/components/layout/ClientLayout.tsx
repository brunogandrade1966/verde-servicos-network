
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarInset
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Search, 
  Users, 
  FileText, 
  MessageSquare, 
  User, 
  LogOut,
  Leaf,
  PlusCircle,
  Briefcase
} from 'lucide-react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSignOut = async () => {
    await signOut();
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
      description: "Visão geral e estatísticas"
    },
    {
      title: "Solicitar Serviço",
      icon: PlusCircle,
      path: "/services",
      description: "Buscar e solicitar serviços"
    },
    {
      title: "Buscar Profissionais",
      icon: Users,
      path: "/professionals",
      description: "Encontrar profissionais qualificados"
    },
    {
      title: "Meus Projetos",
      icon: Briefcase,
      path: "/my-projects",
      description: "Projetos em andamento e concluídos"
    },
    {
      title: "Minhas Demandas",
      icon: FileText,
      path: "/my-demands",
      description: "Demandas publicadas"
    },
    {
      title: "Candidaturas Recebidas",
      icon: MessageSquare,
      path: "/applications",
      description: "Gerenciar candidaturas"
    },
    {
      title: "Meu Perfil",
      icon: User,
      path: "/profile",
      description: "Configurações do perfil"
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Ambiental</h2>
                <p className="text-xs text-gray-500">Partners</p>
              </div>
            </div>
          </SidebarHeader>
          
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
        </Sidebar>

        <SidebarInset className="flex-1">
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
          
          <main className="flex-1 p-4">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ClientLayout;
