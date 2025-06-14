
import { Card, CardContent } from '@/components/ui/card';

const AdminSystemStatus = () => {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Status do Sistema</h3>
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Sistema Operacional</span>
            </div>
            <div className="text-sm text-gray-500">
              Última atualização: {new Date().toLocaleString('pt-BR')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemStatus;
