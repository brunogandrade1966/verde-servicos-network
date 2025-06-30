
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Candidaturas ({applications.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhuma candidatura ainda.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={application.professional?.avatar_url} 
                          alt={application.professional?.name} 
                        />
                        <AvatarFallback>
                          {application.professional?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{application.professional?.name}</h4>
                        <p className="text-sm text-gray-500">
                          {application.professional?.area_of_expertise}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{application.proposal}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Valor: R$ {application.proposed_price?.toLocaleString('pt-BR')}</span>
                      {application.estimated_duration && (
                        <span>Duração: {application.estimated_duration}</span>
                      )}
                      <span>
                        {new Date(application.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge 
                      variant={
                        application.status === 'accepted' ? 'default' :
                        application.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                    >
                      {application.status === 'pending' && 'Pendente'}
                      {application.status === 'accepted' && 'Aceita'}
                      {application.status === 'rejected' && 'Rejeitada'}
                    </Badge>
                    {isOwnDemand && application.status === 'pending' && (
                      <div className="flex flex-col space-y-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => onUpdateApplicationStatus(application.id, 'accepted')}
                        >
                          Aceitar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onUpdateApplicationStatus(application.id, 'rejected')}
                        >
                          Rejeitar
                        </Button>
                      </div>
                    )}
                    {(isOwnDemand || application.professional_id === profileId) && (
                      <StartPartnershipConversation
                        partnershipDemandId={demandId}
                        creatorId={demandProfessionalId}
                        applicantId={application.professional_id}
                        disabled={!demandId}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PartnershipApplicationsList;
