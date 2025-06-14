
import { Button } from '@/components/ui/button';
import { Leaf, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BrowseProjectsHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Buscar Projetos</h1>
              <p className="text-sm text-gray-500">Encontre oportunidades para seu negócio</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BrowseProjectsHeader;
