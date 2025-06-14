
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Professional {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  professional_services: Array<{
    id: string;
    price_range?: string;
    experience_years?: number;
    services: {
      name: string;
      category: string;
    };
  }>;
}

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard = ({ professional }: ProfessionalCardProps) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/professionals/${professional.id}`);
  };

  const handleHire = () => {
    // TODO: Implement hiring functionality
    console.log('Hiring professional:', professional.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{professional.name}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-gray-300" />
                <span className="text-sm text-gray-600 ml-1">(4.0)</span>
              </div>
            </div>
            {professional.bio && (
              <CardDescription className="text-sm">
                {professional.bio.length > 120 
                  ? `${professional.bio.substring(0, 120)}...` 
                  : professional.bio
                }
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Especialidades:</h4>
            <div className="flex flex-wrap gap-2">
              {professional.professional_services.map((ps) => (
                <Badge key={ps.id} variant="outline">
                  {ps.services.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600">
              {professional.professional_services.length > 0 && 
               professional.professional_services[0].experience_years && (
                <span>{professional.professional_services[0].experience_years} anos de experiência</span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleViewProfile}>
                Ver Perfil
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleHire}>
                Contratar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCard;
