
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PartnershipDetailsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/partnerships')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
      <h1 className="text-2xl font-bold">Detalhes da Demanda de Parceria</h1>
    </div>
  );
};

export default PartnershipDetailsHeader;
