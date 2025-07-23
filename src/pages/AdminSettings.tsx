import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Database, Mail, Shield, Globe } from 'lucide-react';

const AdminSettings = () => {
  const { profile } = useAuth();

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const systemSettings = [
    {
      category: 'Geral',
      icon: Settings,
      settings: [
        { name: 'Nome da Plataforma', value: 'EcoConecta', type: 'text' },
        { name: 'URL Base', value: 'https://ecoconecta.com', type: 'text' },
        { name: 'Fuso Horário', value: 'America/Sao_Paulo', type: 'select' },
        { name: 'Idioma Padrão', value: 'pt-BR', type: 'select' }
      ]
    },
    {
      category: 'Autenticação',
      icon: Shield,
      settings: [
        { name: 'Registro de Usuários', value: true, type: 'boolean' },
        { name: 'Confirmação de Email', value: true, type: 'boolean' },
        { name: 'Login Social', value: false, type: 'boolean' },
        { name: 'Sessão Expira em (horas)', value: '24', type: 'number' }
      ]
    },
    {
      category: 'Email',
      icon: Mail,
      settings: [
        { name: 'Email de Suporte', value: 'suporte@ecoconecta.com', type: 'text' },
        { name: 'Email de Notificações', value: 'noreply@ecoconecta.com', type: 'text' },
        { name: 'Envio de Newsletters', value: true, type: 'boolean' },
        { name: 'Limite de Emails/Hora', value: '100', type: 'number' }
      ]
    },
    {
      category: 'API',
      icon: Globe,
      settings: [
        { name: 'Rate Limiting', value: true, type: 'boolean' },
        { name: 'Requests por Minuto', value: '60', type: 'number' },
        { name: 'CORS Habilitado', value: true, type: 'boolean' },
        { name: 'API Version', value: 'v1', type: 'text' }
      ]
    }
  ];

  const renderSettingInput = (setting: any) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.value}
            onCheckedChange={() => {}}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            className="w-24"
            readOnly
          />
        );
      default:
        return (
          <Input
            value={setting.value}
            className="w-64"
            readOnly
          />
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600">Configure parâmetros e configurações do sistema</p>
        </div>

        {/* Status do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800 mb-2">Online</Badge>
                <p className="text-sm text-gray-600">Servidor</p>
              </div>
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800 mb-2">Conectado</Badge>
                <p className="text-sm text-gray-600">Banco de Dados</p>
              </div>
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800 mb-2">Operacional</Badge>
                <p className="text-sm text-gray-600">Email</p>
              </div>
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800 mb-2">Ativo</Badge>
                <p className="text-sm text-gray-600">Storage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações por Categoria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {systemSettings.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.settings.map((setting, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          {setting.name}
                        </Label>
                        {renderSettingInput(setting)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ações de Manutenção */}
        <Card>
          <CardHeader>
            <CardTitle>Ações de Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Database className="h-6 w-6" />
                <span>Backup Manual</span>
                <span className="text-xs text-gray-500">Criar backup do banco</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Settings className="h-6 w-6" />
                <span>Limpar Cache</span>
                <span className="text-xs text-gray-500">Limpar cache do sistema</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Shield className="h-6 w-6" />
                <span>Verificar Segurança</span>
                <span className="text-xs text-gray-500">Auditoria de segurança</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Versão:</strong> 1.0.0</p>
                <p><strong>Ambiente:</strong> Produção</p>
                <p><strong>Última Atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p><strong>Uptime:</strong> 99.9%</p>
                <p><strong>Região:</strong> Brasil (São Paulo)</p>
                <p><strong>Provedor:</strong> Supabase</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;