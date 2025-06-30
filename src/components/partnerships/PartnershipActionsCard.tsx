
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Edit } from 'lucide-react';
import { useState } from 'react';
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

interface PartnershipActionsCardProps {
  isOwnDemand: boolean;
  canApply: boolean;
  applications: Application[];
  onApply: () => void;
  onEdit: () => void;
  onUpdateApplicationStatus: (applicationId: string, status: 'pending' | 'accepted' | 'rejected') => void;
  demandId: string;
  demandProfessionalId: string;
}

const PartnershipActionsCard = ({
  isOwnDemand,
  canApply,
  applications,
  onApply,
  onEdit,
  onUpdateApplicationStatus,
  demandId,
  demandProfessionalId
}: PartnershipActionsCardProps) => {
  const [showApplicationsDialog, setShowApplicationsDialog] = useState(false);

  if (canApply) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Candidatar-se</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
            onClick={onApply}
          >
            Enviar Candidatura
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Envie sua proposta para formar parceria neste projeto
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isOwnDemand) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suas Ações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Dialog open={showApplicationsDialog} onOpenChange={setShowApplicationsDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Candidaturas ({applications.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Candidaturas para a Demanda</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {applications.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma candidatura recebida ainda.
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
                            {application.status === 'pending' && (
                              <div className="flex flex-col space-y-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => {
                                    onUpdateApplicationStatus(application.id, 'accepted');
                                    setShowApplicationsDialog(false);
                                  }}
                                >
                                  Aceitar
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    onUpdateApplicationStatus(application.id, 'rejected');
                                    setShowApplicationsDialog(false);
                                  }}
                                >
                                  Rejeitar
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Demanda
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default PartnershipActionsCard;
