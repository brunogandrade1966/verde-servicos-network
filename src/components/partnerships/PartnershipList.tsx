
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import PartnershipDemandCard from './PartnershipDemandCard';

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
  status: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
    avatar_url?: string;
  };
}

interface PartnershipListProps {
  demands: PartnershipDemand[];
  filteredDemands: PartnershipDemand[];
  loading: boolean;
  userType?: string;
}

const PartnershipList = ({ demands, filteredDemands, loading, userType }: PartnershipListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Carregando demandas de parceria...</p>
      </div>
    );
  }

  if (filteredDemands.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {demands.length === 0 ? 'Nenhuma demanda disponível' : 'Nenhum resultado encontrado'}
          </h3>
          <p className="text-gray-600 mb-4">
            {demands.length === 0 
              ? 'Ainda não há demandas de parceria criadas por outros profissionais.'
              : 'Tente ajustar os filtros para encontrar demandas relevantes.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredDemands.map((demand) => (
        <PartnershipDemandCard
          key={demand.id}
          demand={demand}
          showApplyButton={userType === 'professional'}
        />
      ))}
    </div>
  );
};

export default PartnershipList;
