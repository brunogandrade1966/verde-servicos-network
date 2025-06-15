
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface PartnershipStatsProps {
  totalDemands: number;
  filteredCount: number;
  categoriesCount: number;
}

const PartnershipStats = ({ totalDemands, filteredCount, categoriesCount }: PartnershipStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-green-600">
            {totalDemands}
          </CardTitle>
          <p className="text-sm text-gray-600">Demandas Disponíveis</p>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-blue-600">
            {filteredCount}
          </CardTitle>
          <p className="text-sm text-gray-600">Resultados Filtrados</p>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-purple-600">
            {categoriesCount}
          </CardTitle>
          <p className="text-sm text-gray-600">Categorias Disponíveis</p>
        </CardHeader>
      </Card>
    </div>
  );
};

export default PartnershipStats;
