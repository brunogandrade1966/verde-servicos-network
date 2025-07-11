
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
  BarChart3,
  Handshake,
  CreditCard
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
        description: "Visão geral de candidaturas, demandas em execução e avaliações"
      }
    ];

    if (profile?.user_type === 'professional') {
      return [
        ...baseItems,
        {
          title: "Perfil",
          icon: User,
          path: "/profile",
          description: "Edição do perfil profissional (formação, serviços habilitados, entidade)"
        },
        {
          title: "Criar Solicitação de Parceria",
          icon: UserPlus,
          path: "/partnerships/create",
          description: "Formulário para buscar outros profissionais"
        },
        {
          title: "Candidaturas Recebidas para Parceria",
          icon: Handshake,
          path: "/my-partnership-requests",
          description: "Profissionais interessados em suas parcerias"
        },
        {
          title: "Oportunidades",
          icon: Search,
          path: "/projects",
          description: "Lista de demandas de clientes e parcerias abertas por outros profissionais"
        },
        {
          title: "Minhas Candidaturas",
          icon: ClipboardList,
          path: "/my-applications",
          description: "Candidaturas enviadas para demandas ou parcerias"
        },
        {
          title: "Demandas e Parcerias",
          icon: Briefcase,
          path: "/contracted-projects",
          description: "Gestão de serviços em execução ou finalizados"
        },
        {
          title: "Mensagens",
          icon: MessageSquare,
          path: "/messages",
          description: "Interface de chat para comunicação com clientes e parceiros"
        },
        {
          title: "Relatórios",
          icon: BarChart3,
          path: "/reports",
          description: "Métricas de atuação, avaliações e histórico de trabalhos"
        },
        {
          title: "Planos",
          icon: CreditCard,
          path: "/subscription",
          description: "Gerenciar plano de assinatura e pagamentos"
        }
      ];
    }

    // Menu para clientes - estrutura atualizada conforme solicitado
    return [
      ...baseItems,
      {
        title: "Perfil",
        icon: User,
        path: "/profile",
        description: "Edição dos dados pessoais, plano e informações de contato"
      },
      {
        title: "Buscar Profissional",
        icon: Search,
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
        },
        {
          title: "Planos",
          icon: CreditCard,
          path: "/subscription",
          description: "Gerenciar plano de assinatura e pagamentos"
        },
      // Adicionar itens de menu para admin se necessário
      ...(profile?.user_type === 'admin' ? [
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
      ] : [])
    ];
  };

  return getMenuItems();
};
