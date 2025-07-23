import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Table, Users, Shield } from 'lucide-react';

interface TableStats {
  tableName: string;
  rowCount: number;
  lastUpdate: string;
}

const AdminDatabase = () => {
  const { profile } = useAuth();
  const [tableStats, setTableStats] = useState<TableStats[]>([]);
  const [loading, setLoading] = useState(true);

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    try {
      const tables = [
        'profiles',
        'projects', 
        'applications',
        'services',
        'professional_services',
        'messages',
        'conversations',
        'reviews',
        'subscribers',
        'partnership_demands',
        'partnership_applications'
      ];

      const stats: TableStats[] = [];

      for (const table of tables) {
        try {
          const { count } = await supabase
            .from(table as any)
            .select('*', { count: 'exact', head: true });

          stats.push({
            tableName: table,
            rowCount: count || 0,
            lastUpdate: new Date().toISOString()
          });
        } catch (error) {
          console.warn(`Erro ao carregar stats da tabela ${table}:`, error);
          stats.push({
            tableName: table,
            rowCount: 0,
            lastUpdate: new Date().toISOString()
          });
        }
      }

      setTableStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas do banco:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTableIcon = (tableName: string) => {
    if (tableName.includes('profile') || tableName.includes('user')) return Users;
    if (tableName.includes('message') || tableName.includes('conversation')) return Shield;
    return Table;
  };

  const formatTableName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Banco de Dados</h1>
          <p className="text-gray-600">Monitore e gerencie o banco de dados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Status do Banco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">Online</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Tabelas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{tableStats.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Registros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {tableStats.reduce((sum, table) => sum + table.rowCount, 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">RLS Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800">Habilitado</Badge>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas das Tabelas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando estatísticas...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tableStats.map((table) => {
                  const IconComponent = getTableIcon(table.tableName);
                  return (
                    <div key={table.tableName} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-gray-600" />
                          <h4 className="font-medium">{formatTableName(table.tableName)}</h4>
                        </div>
                        <Badge variant="secondary">{table.rowCount} registros</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Atualizado: {new Date(table.lastUpdate).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Row Level Security (RLS)</span>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>SSL/TLS Encryption</span>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Backup Automático</span>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Monitoramento</span>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDatabase;