
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

const AdminSystemStatus = () => {
  const systemServices = [
    {
      name: 'API Server',
      status: 'online',
      uptime: '99.9%',
      lastCheck: '2 min atrás'
    },
    {
      name: 'Database',
      status: 'online',
      uptime: '99.8%',
      lastCheck: '1 min atrás'
    },
    {
      name: 'File Storage',
      status: 'online',
      uptime: '100%',
      lastCheck: '30 seg atrás'
    },
    {
      name: 'Email Service',
      status: 'warning',
      uptime: '98.5%',
      lastCheck: '5 min atrás'
    },
    {
      name: 'Search Engine',
      status: 'online',
      uptime: '99.7%',
      lastCheck: '1 min atrás'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Online</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Atenção</Badge>;
      case 'offline':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Offline</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Status do Sistema</h2>
      <div className="grid gap-4">
        {systemServices.map((service) => (
          <Card key={service.name}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500">
                    Uptime: {service.uptime} • Último check: {service.lastCheck}
                  </p>
                </div>
              </div>
              {getStatusBadge(service.status)}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Sistema Geral</CardTitle>
          <CardDescription>
            Todos os serviços principais estão operacionais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Sistema Operacional</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemStatus;
