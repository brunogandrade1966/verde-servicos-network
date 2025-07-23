import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminPermissions = () => {
  const { profile } = useAuth();

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const userTypes = [
    {
      type: 'admin',
      label: 'Administrador',
      description: 'Acesso total ao sistema',
      permissions: [
        'Gerenciar usuários',
        'Gerenciar projetos',
        'Gerenciar serviços',
        'Visualizar estatísticas',
        'Configurar sistema',
        'Moderar conteúdo'
      ]
    },
    {
      type: 'professional',
      label: 'Profissional',
      description: 'Acesso para prestar serviços',
      permissions: [
        'Criar perfil profissional',
        'Candidatar-se a projetos',
        'Criar demandas de parceria',
        'Comunicar com clientes',
        'Gerenciar serviços próprios'
      ]
    },
    {
      type: 'client',
      label: 'Cliente',
      description: 'Acesso para contratar serviços',
      permissions: [
        'Criar projetos',
        'Buscar profissionais',
        'Comunicar com profissionais',
        'Avaliar serviços',
        'Gerenciar projetos próprios'
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Permissões</h1>
          <p className="text-gray-600">Configure permissões e níveis de acesso por tipo de usuário</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTypes.map((userType) => (
            <Card key={userType.type}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{userType.label}</CardTitle>
                  <Badge 
                    className={
                      userType.type === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : userType.type === 'professional'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }
                  >
                    {userType.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{userType.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Permissões:</h4>
                  <ul className="space-y-1">
                    {userType.permissions.map((permission, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">Row Level Security (RLS)</h4>
                  <p className="text-sm text-gray-600">Controle de acesso em nível de linha habilitado</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">Autenticação</h4>
                  <p className="text-sm text-gray-600">Sistema de autenticação Supabase</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">Validação de Email</h4>
                  <p className="text-sm text-gray-600">Confirmação automática de email habilitada</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPermissions;