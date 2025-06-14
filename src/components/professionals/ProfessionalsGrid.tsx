
import { Card, CardContent } from '@/components/ui/card';
import ProfessionalCard from './ProfessionalCard';

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

interface ProfessionalsGridProps {
  professionals: Professional[];
  loading: boolean;
}

const ProfessionalsGrid = ({ professionals, loading }: ProfessionalsGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum profissional encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Tente ajustar os filtros de busca ou remova alguns critérios.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {professionals.map((professional) => (
        <ProfessionalCard key={professional.id} professional={professional} />
      ))}
    </div>
  );
};

export default ProfessionalsGrid;
