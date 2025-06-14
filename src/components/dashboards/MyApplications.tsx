
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  status: string;
  proposed_price?: number;
  created_at: string;
  projects: {
    title: string;
    status: string;
  };
}

interface MyApplicationsProps {
  applications: Application[];
  loading: boolean;
}

const MyApplications = ({ applications, loading }: MyApplicationsProps) => {
  const navigate = useNavigate();

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getApplicationStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendente', variant: 'outline' as const },
      accepted: { label: 'Aceita', variant: 'default' as const },
      rejected: { label: 'Rejeitada', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
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
              Comece a se candidatar a projetos para expandir seus negócios.
            </p>
            <Button onClick={() => navigate('/projects')} className="bg-green-600 hover:bg-green-700">
              <Search className="h-4 w-4 mr-2" />
              Buscar Projetos
            </Button>
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
          <Card key={application.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{application.projects?.title}</CardTitle>
                {getApplicationStatusBadge(application.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  Enviada em {new Date(application.created_at).toLocaleDateString('pt-BR')}
                </span>
                {application.proposed_price && (
                  <span className="text-green-600 font-medium">
                    {formatCurrency(application.proposed_price)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
