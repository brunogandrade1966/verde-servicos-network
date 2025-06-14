
import { Button } from '@/components/ui/button';
import { Leaf, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const EditProjectHeader = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Editar Demanda</h1>
              <p className="text-sm text-gray-500">Atualize sua demanda ambiental</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
