
import { Button } from '@/components/ui/button';
import { Users, FileText, Briefcase, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminQuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center space-y-2"
          onClick={() => navigate('/admin/users')}
        >
          <Users className="h-6 w-6" />
          <span>Gerenciar Usuários</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center space-y-2"
          onClick={() => navigate('/admin/projects')}
        >
          <FileText className="h-6 w-6" />
          <span>Gerenciar Projetos</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center space-y-2"
          onClick={() => navigate('/admin/services')}
        >
          <Briefcase className="h-6 w-6" />
          <span>Gerenciar Serviços</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center space-y-2"
          onClick={() => navigate('/admin/reports')}
        >
          <Star className="h-6 w-6" />
          <span>Relatórios</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminQuickActions;
