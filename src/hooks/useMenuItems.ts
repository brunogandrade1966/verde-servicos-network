
import { 
  Home, 
  Search, 
  Users, 
  FileText, 
  MessageSquare, 
  User, 
  PlusCircle,
  Briefcase,
  Settings,
  Upload,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const useMenuItems = () => {
  const { profile } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        icon: Home,
        path: "/dashboard",
        description: "Visão geral e estatísticas"
      }
    ];

    if (profile?.user_type === 'professional') {
      return [
        ...baseItems,
        {
          title: "Meus Projetos",
          icon: Briefcase,
          path: "/contracted-projects",
          description: "Projetos em andamento e concluídos"
        },
        {
          title: "Publicar Solicitação de Parceria",
          icon: UserPlus,
          path: "/partnerships/create",
          description: "Criar nova solicitação de parceria"
        },
        {
          title: "Minhas Solicitações de Parceria",
          icon: FileText,
          path: "/my-partnership-requests",
          description: "Solicitações de parceria publicadas"
        },
        {
          title: "Demandas de Parcerias",
          icon: Search,
          path: "/partnerships",
          description: "Buscar oportunidades de parceria"
        },
        {
          title: "Demandas de Clientes",
          icon: Users,
          path: "/projects",
          description: "Buscar projetos disponíveis"
        },
        {
          title: "Minhas Candidaturas",
          icon: MessageSquare,
          path: "/my-applications",
          description: "Candidaturas enviadas"
        },
        {
          title: "Meu Perfil",
          icon: User,
          path: "/profile",
          description: "Configurações do perfil"
        }
      ];
    }

    // Menu para clientes
    const clientItems = [
      ...baseItems,
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

    // Adicionar itens de menu para admin
    if (profile?.user_type === 'admin') {
      clientItems.push(
        {
          title: "Gerenciar Serviços",
          icon: Settings,
          path: "/admin/services",
          description: "Administrar serviços do sistema"
        },
        {
          title: "Importar Serviços",
          icon: Upload,
          path: "/admin/import-services",
          description: "Carregar serviços predefinidos"
        }
      );
    }

    return clientItems;
  };

  return getMenuItems();
};
