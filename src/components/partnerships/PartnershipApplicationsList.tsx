
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, User, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionGuard } from '@/components/subscription/SubscriptionGuard';
import StartPartnershipConversation from './StartPartnershipConversation';

interface Application {
  id: string;
  professional_id: string;
  proposal: string;
  proposed_price?: number;
  estimated_duration?: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
  professional?: {
    id: string;
    name: string;
    avatar_url?: string;
    area_of_expertise?: string;
  };
}

interface PartnershipApplicationsListProps {
  applications: Application[];
  isOwnDemand: boolean;
  demandId: string;
  demandProfessionalId: string;
  profileId?: string;
  onUpdateApplicationStatus: (applicationId: string, status: 'pending' | 'accepted' | 'rejected') => void;
}

const PartnershipApplicationsList = ({ 
  applications, 
  isOwnDemand, 
  demandId, 
  demandProfessionalId,
  profileId,
  onUpdateApplicationStatus 
}: PartnershipApplicationsListProps) => {
  const navigate = useNavigate();

  const handleViewProfile = (professionalId?: string) => {
    if (professionalId) {
      navigate(`/professionals/${professionalId}`);
    }
  };
  return (
    <SubscriptionGuard
      fallback={
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Candidaturas ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-8">
              Você precisa de um plano ativo para visualizar os detalhes das candidaturas.
            </p>
          </CardContent>
        </Card>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Candidaturas ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length > 0 ? (
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
                          {application.professional?.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {application.professional?.area_of_expertise}
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      application.status === 'pending' ? 'secondary' : 
                      application.status === 'accepted' ? 'default' :
                      'destructive'
                    }>
                      {application.status === 'pending' ? 'Pendente' : 
                       application.status === 'accepted' ? 'Aceita' : 'Rejeitada'}
                    </Badge>
                  </div>

                  <p className="text-gray-700 mb-3">{application.proposal}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      {application.proposed_price && (
                        <span className="text-green-600 font-medium">
                          R$ {application.proposed_price.toLocaleString('pt-BR')}
                        </span>
                      )}
                      {application.estimated_duration && (
                        <span className="text-gray-500">
                          Prazo: {application.estimated_duration}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewProfile(application.professional?.id)}
                      >
                        Ver Perfil
                      </Button>
                      
                      {isOwnDemand && application.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => onUpdateApplicationStatus(application.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aceitar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onUpdateApplicationStatus(application.id, 'rejected')}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        </>
                      )}
                    </div>
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
    </SubscriptionGuard>
  );
};

export default PartnershipApplicationsList;
