
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, User } from 'lucide-react';

interface Application {
  id: string;
  proposed_price?: number;
  proposal: string;
  status: string;
  estimated_duration?: string;
  created_at: string;
  profiles: {
    name: string;
    bio?: string;
    avatar_url?: string;
  };
}

interface Profile {
  user_type?: string;
}

interface ProjectApplicationsProps {
  applications: Application[];
  profile: Profile | null;
}

const ProjectApplications = ({ applications, profile }: ProjectApplicationsProps) => {
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Candidaturas ({applications?.length || 0})
        </CardTitle>
        <CardDescription>
          Profissionais interessados neste projeto
        </CardDescription>
      </CardHeader>
      <CardContent>
        {applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {application.profiles?.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(application.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={application.status === 'pending' ? 'secondary' : 'default'}>
                    {application.status === 'pending' ? 'Pendente' : application.status}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-3">{application.proposal}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    {application.proposed_price && (
                      <span className="text-green-600 font-medium">
                        {formatCurrency(application.proposed_price)}
                      </span>
                    )}
                    {application.estimated_duration && (
                      <span className="text-gray-500">
                        Prazo: {application.estimated_duration}
                      </span>
                    )}
                  </div>
                  {profile?.user_type === 'client' && application.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Ver Perfil
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Aceitar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhuma candidatura recebida ainda.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectApplications;
