
import { Button } from '@/components/ui/button';
import { Search, Users, Briefcase, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-4 mb-6">
      <Button onClick={() => navigate('/projects')} className="bg-green-600 hover:bg-green-700">
        <Search className="h-4 w-4 mr-2" />
        Buscar Projetos
      </Button>
      <Button variant="outline" onClick={() => navigate('/professionals')}>
        <Users className="h-4 w-4 mr-2" />
        Encontrar Profissionais
      </Button>
      <Button variant="outline" onClick={() => navigate('/my-services')}>
        <Briefcase className="h-4 w-4 mr-2" />
        Meus Serviços
      </Button>
      <Button variant="outline" onClick={() => navigate('/profile')}>
        <Star className="h-4 w-4 mr-2" />
        Meu Perfil
      </Button>
    </div>
  );
};

export default DashboardNavigation;
