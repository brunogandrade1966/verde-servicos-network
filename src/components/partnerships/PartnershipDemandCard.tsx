
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface PartnershipDemandCardProps {
  demand: PartnershipDemand;
  showApplyButton?: boolean;
}

const PartnershipDemandCard = ({ demand, showApplyButton = true }: PartnershipDemandCardProps) => {
  const navigate = useNavigate();

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

  const handleViewDetails = () => {
    navigate(`/partnerships/${demand.id}`);
  };

  const handleApply = () => {
    navigate(`/partnerships/${demand.id}/apply`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{demand.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">{demand.services.category}</Badge>
              <Badge className={getCollaborationTypeColor(demand.collaboration_type)}>
                {getCollaborationTypeLabel(demand.collaboration_type)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>Por {demand.profiles.name}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {demand.description}
        </p>

        {demand.required_skills && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Habilidades Requeridas:</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{demand.required_skills}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          {demand.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{demand.location}</span>
            </div>
          )}
          
          {demand.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Até {new Date(demand.deadline).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
          
          {formatBudget(demand.budget_min, demand.budget_max) && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{formatBudget(demand.budget_min, demand.budget_max)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewDetails} className="flex-1">
            Ver Detalhes
          </Button>
          {showApplyButton && (
            <Button 
              onClick={handleApply}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Candidatar-se
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnershipDemandCard;
