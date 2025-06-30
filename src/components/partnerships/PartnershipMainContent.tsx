import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import PartnershipStatusUpdater from './PartnershipStatusUpdater';
import ServiceCompletionConfirmation from '@/components/reviews/ServiceCompletionConfirmation';
import MutualReviewSystem from '@/components/reviews/MutualReviewSystem';
import PartnershipApplicationsList from './PartnershipApplicationsList';
import PartnershipReadOnlyView from './PartnershipReadOnlyView';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

interface PartnershipDemand {
  id: string;
  title: string;
  description: string;
  collaboration_type: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  required_skills?: string;
  created_at: string;
  status: ProjectStatus;
  professional_id: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
    avatar_url?: string;
    bio?: string;
    email: string;
    phone?: string;
    whatsapp?: string;
  };
}

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

interface PartnershipMainContentProps {
  demand: PartnershipDemand;
  applications: Application[];
  isOwnDemand: boolean;
  partnerProfessional?: { id: string; name: string } | null;
  profileId?: string;
  userType?: string;
  onStatusUpdate: () => void;
  onUpdateApplicationStatus: (applicationId: string, status: 'pending' | 'accepted' | 'rejected') => void;
}

const PartnershipMainContent = ({
  demand,
  applications,
  isOwnDemand,
  partnerProfessional,
  profileId,
  userType,
  onStatusUpdate,
  onUpdateApplicationStatus
}: PartnershipMainContentProps) => {
  // Se a parceria está finalizada e o usuário é o profissional criador, mostrar visão somente leitura
  if (demand.status === 'completed' && isOwnDemand) {
    return <PartnershipReadOnlyView demand={demand} />;
  }

  const getCollaborationTypeLabel = (type: string) => {
    const types = {
      complementary: 'Complementar',
      joint: 'Conjunta',
      subcontract: 'Subcontratação'
    };
    return types[type as keyof typeof types] || type;
  };

  const getCollaborationTypeColor = (type: string) => {
    const colors = {
      complementary: 'bg-blue-100 text-blue-800',
      joint: 'bg-green-100 text-green-800',
      subcontract: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`;
    if (min) return `A partir de R$ ${min.toLocaleString()}`;
    if (max) return `Até R$ ${max.toLocaleString()}`;
    return null;
  };

  // Convert userType to the expected type for PartnershipStatusUpdater
  const getValidUserType = (type?: string): 'client' | 'professional' => {
    if (type === 'client') return 'client';
    return 'professional'; // Default to professional for admin and professional types
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Card with project description */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{demand.services.category}</Badge>
            <Badge className={getCollaborationTypeColor(demand.collaboration_type)}>
              {getCollaborationTypeLabel(demand.collaboration_type)}
            </Badge>
          </div>
          <CardTitle className="text-2xl">{demand.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Descrição do Projeto</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{demand.description}</p>
            </div>

            {demand.required_skills && (
              <div>
                <h3 className="font-semibold mb-2">Habilidades/Especialidades Requeridas</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{demand.required_skills}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demand.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{demand.location}</span>
                </div>
              )}
              
              {demand.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>Prazo: {new Date(demand.deadline).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              
              {formatBudget(demand.budget_min, demand.budget_max) && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <span>{formatBudget(demand.budget_min, demand.budget_max)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partnership Status Updater */}
      {(isOwnDemand || (partnerProfessional && profileId === partnerProfessional.id)) && (
        <PartnershipStatusUpdater
          demandId={demand.id}
          currentStatus={demand.status}
          userType={getValidUserType(userType)}
          isCreator={isOwnDemand}
          isPartner={partnerProfessional ? profileId === partnerProfessional.id : false}
          onStatusUpdate={onStatusUpdate}
        />
      )}

      {/* Service Completion Confirmation - apenas para o profissional contratante */}
      {demand.status === 'completed' && isOwnDemand && partnerProfessional && (
        <ServiceCompletionConfirmation
          partnershipDemandId={demand.id}
          providerId={partnerProfessional.id}
          providerName={partnerProfessional.name}
          contractorId={demand.professional_id}
          status={demand.status}
          onConfirmation={onStatusUpdate}
        />
      )}

      {/* Mutual Review System */}
      {demand.status === 'completed' && partnerProfessional && (
        <MutualReviewSystem
          partnershipDemandId={demand.id}
          professionalId={partnerProfessional.id}
          professionalName={partnerProfessional.name}
          contractorId={demand.professional_id}
          status={demand.status}
        />
      )}

      {/* Applications - apenas se não estiver finalizada */}
      {demand.status !== 'completed' && (
        <PartnershipApplicationsList
          applications={applications}
          isOwnDemand={isOwnDemand}
          demandId={demand.id}
          demandProfessionalId={demand.professional_id}
          profileId={profileId}
          onUpdateApplicationStatus={onUpdateApplicationStatus}
        />
      )}
    </div>
  );
};

export default PartnershipMainContent;
