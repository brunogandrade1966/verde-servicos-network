
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContractedProjectsHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Demandas Contratadas
            </h1>
            <p className="text-gray-600">
              Acompanhe o progresso dos seus projetos em andamento
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ContractedProjectsHeader;
