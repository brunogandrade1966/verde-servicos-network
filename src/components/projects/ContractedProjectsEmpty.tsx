
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ContractedProjectsEmptyProps {
  userType?: string;
}

const ContractedProjectsEmpty = ({ userType }: ContractedProjectsEmptyProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma demanda contratada
        </h3>
        <p className="text-gray-600 mb-4">
          {userType === 'client' 
            ? 'Você ainda não tem projetos em andamento.'
            : 'Você ainda não foi contratado para nenhuma demanda.'
          }
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Voltar ao Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContractedProjectsEmpty;
