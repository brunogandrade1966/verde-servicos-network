
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
  UserPlus,
  ClipboardList,
  BarChart3
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
        description: "Visão geral de suas demandas, candidaturas e avaliações recebidas"
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
        title: "Perfil",
        icon: User,
        path: "/profile",
        description: "Edição dos dados pessoais, plano e informações de contato"
      },
      {
        title: "Buscar Profissional",
        icon: Users,
        path: "/professionals",
        description: "Lista de profissionais por serviço e localidade"
      },
      {
        title: "Criar Demanda",
        icon: PlusCircle,
        path: "/create-project",
        description: "Formulário para solicitar um novo serviço ambiental"
      },
      {
        title: "Minhas Demandas",
        icon: Briefcase,
        path: "/my-projects",
        description: "Lista das demandas contratadas ou em andamento"
      },
      {
        title: "Candidaturas",
        icon: ClipboardList,
        path: "/applications",
        description: "Lista de profissionais que se candidataram às suas demandas"
      },
      {
        title: "Mensagens",
        icon: MessageSquare,
        path: "/messages",
        description: "Interface de chat com os profissionais envolvidos"
      },
      {
        title: "Relatórios",
        icon: BarChart3,
        path: "/reports",
        description: "Histórico de contratações, avaliações e execução"
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
