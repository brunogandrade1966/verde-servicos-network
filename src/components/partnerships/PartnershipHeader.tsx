
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PartnershipHeaderProps {
  userType?: string;
}

const PartnershipHeader = ({ userType }: PartnershipHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Demandas de Parcerias
        </h1>
        <p className="text-gray-600">
          Encontre oportunidades de parceria criadas por outros profissionais
        </p>
      </div>
      
      {userType === 'professional' && (
        <Button
          onClick={() => navigate('/partnerships/create')}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Criar Demanda
        </Button>
      )}
    </div>
  );
};

export default PartnershipHeader;
