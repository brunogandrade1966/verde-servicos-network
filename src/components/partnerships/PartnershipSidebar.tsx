
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Mail, Phone } from 'lucide-react';
import PartnershipActionsCard from './PartnershipActionsCard';
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

interface PartnershipSidebarProps {
  demand: PartnershipDemand;
  applications: Application[];
  isOwnDemand: boolean;
  canApply: boolean;
  onApply: () => void;
  onEdit: () => void;
  onUpdateApplicationStatus: (applicationId: string, status: 'pending' | 'accepted' | 'rejected') => void;
}

const PartnershipSidebar = ({
  demand,
  applications,
  isOwnDemand,
  canApply,
  onApply,
  onEdit,
  onUpdateApplicationStatus
}: PartnershipSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Perfil do Profissional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={demand.profiles.avatar_url} />
              <AvatarFallback>
                {demand.profiles.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{demand.profiles.name}</h4>
              <p className="text-sm text-gray-600">
                Publicado em {new Date(demand.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {demand.profiles.bio && (
            <p className="text-sm text-gray-600 mb-4">{demand.profiles.bio}</p>
          )}

          <div className="space-y-2">
            {demand.profiles.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{demand.profiles.email}</span>
              </div>
            )}
            
            {demand.profiles.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{demand.profiles.phone}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <PartnershipActionsCard
        isOwnDemand={isOwnDemand}
        canApply={canApply}
        applications={applications}
        onApply={onApply}
        onEdit={onEdit}
        onUpdateApplicationStatus={onUpdateApplicationStatus}
        demandId={demand.id}
        demandProfessionalId={demand.professional_id}
      />
    </div>
  );
};

export default PartnershipSidebar;
