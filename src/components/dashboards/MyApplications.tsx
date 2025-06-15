
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { ApplicationData } from '@/types/dashboard';

interface MyApplicationsProps {
  applications: ApplicationData[];
  loading: boolean;
}

const MyApplications = ({ applications, loading }: MyApplicationsProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pendente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Aceita</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'project':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Projeto</Badge>;
      case 'partnership':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Parceria</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTitle = (application: ApplicationData) => {
    if (application.type === 'project' && application.projects) {
      return application.projects.title;
    }
    if (application.type === 'partnership' && application.partnership_demands) {
      return application.partnership_demands.title;
    }
    return 'Título não disponível';
  };

  const handleViewDetails = (application: ApplicationData) => {
    if (application.type === 'project') {
      navigate('/projects');
    } else {
      navigate('/partnerships');
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Minhas Candidaturas</h2>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Minhas Candidaturas</h2>
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma candidatura enviada
            </h3>
            <p className="text-gray-500 mb-4">
              Você ainda não se candidatou a nenhuma demanda ou projeto.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/projects')} className="bg-green-600 hover:bg-green-700">
                Buscar Projetos
              </Button>
              <Button onClick={() => navigate('/partnerships')} variant="outline">
                Buscar Parcerias
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Minhas Candidaturas</h2>
      <div className="space-y-4">
        {applications.slice(0, 5).map((application) => (
          <Card key={`${application.type}-${application.id}`} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{getTitle(application)}</CardTitle>
                  <CardDescription className="mt-1">
                    Candidatura enviada em {formatDate(application.created_at)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {getTypeBadge(application.type)}
                  {getStatusBadge(application.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600 font-medium">
                  Proposta: {formatCurrency(application.proposed_price)}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewDetails(application)}
                >
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
