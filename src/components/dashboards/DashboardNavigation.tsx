
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Users, 
  Handshake,
  MessageSquare,
  FolderOpen,
  CheckSquare,
  BarChart3
} from 'lucide-react';

const DashboardNavigation = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const clientActions = [
    {
      icon: Plus,
      label: 'Criar Nova Demanda',
      description: 'Publique uma nova demanda de serviço',
      onClick: () => navigate('/create-project'),
      primary: true
    },
    {
      icon: Search,
      label: 'Buscar Profissionais',
      description: 'Encontre profissionais qualificados',
      onClick: () => navigate('/professionals')
    },
    {
      icon: CheckSquare,
      label: 'Demandas Contratadas',
      description: 'Acompanhe seus projetos em andamento',
      onClick: () => navigate('/contracted-projects')
    },
    {
      icon: FolderOpen,
      label: 'Navegar Demandas',
      description: 'Veja todas as demandas da plataforma',
      onClick: () => navigate('/projects')
    },
    {
      icon: MessageSquare,
      label: 'Mensagens',
      description: 'Converse com profissionais',
      onClick: () => navigate('/messages')
    }
  ];

  const professionalActions = [
    {
      icon: Search,
      label: 'Buscar Demandas',
      description: 'Encontre oportunidades de trabalho',
      onClick: () => navigate('/projects'),
      primary: true
    },
    {
      icon: CheckSquare,
      label: 'Projetos Contratados',
      description: 'Seus projetos em andamento',
      onClick: () => navigate('/contracted-projects')
    },
    {
      icon: Handshake,
      label: 'Parcerias',
      description: 'Encontre parceiros profissionais',
      onClick: () => navigate('/partnerships')
    },
    {
      icon: Users,
      label: 'Profissionais',
      description: 'Conecte-se com outros profissionais',
      onClick: () => navigate('/professionals')
    },
    {
      icon: MessageSquare,
      label: 'Mensagens',
      description: 'Converse com clientes e parceiros',
      onClick: () => navigate('/messages')
    }
  ];

  const adminActions = [
    {
      icon: BarChart3,
      label: 'Gerenciar Serviços',
      description: 'Administrar catálogo de serviços',
      onClick: () => navigate('/admin/services'),
      primary: true
    },
    {
      icon: Users,
      label: 'Usuários',
      description: 'Gerenciar usuários da plataforma',
      onClick: () => navigate('/admin/users')
    }
  ];

  const getActions = () => {
    switch (profile?.user_type) {
      case 'client':
        return clientActions;
      case 'professional':
        return professionalActions;
      case 'admin':
        return adminActions;
      default:
        return clientActions;
    }
  };

  const actions = getActions();

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant={action.primary ? "default" : "outline"}
                className={`h-auto p-4 text-left justify-start ${
                  action.primary ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
                onClick={action.onClick}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{action.label}</div>
                    <div className={`text-sm ${
                      action.primary ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardNavigation;
