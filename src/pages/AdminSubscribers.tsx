import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Subscriber {
  id: string;
  user_id: string;
  email: string;
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string;
  created_at: string;
}

const AdminSubscribers = () => {
  const { profile } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Erro ao carregar assinantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'active') return matchesSearch && subscriber.subscribed;
    if (filterType === 'inactive') return matchesSearch && !subscriber.subscribed;
    
    return matchesSearch;
  });

  const getSubscriptionBadge = (subscribed: boolean, tier: string) => {
    if (!subscribed) return <Badge variant="secondary">Inativo</Badge>;
    
    const tierColors = {
      'professional': 'bg-blue-100 text-blue-800',
      'premium': 'bg-purple-100 text-purple-800',
      'basic': 'bg-green-100 text-green-800'
    };
    
    return <Badge className={tierColors[tier as keyof typeof tierColors] || 'bg-gray-100 text-gray-800'}>
      {tier || 'Ativo'}
    </Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Assinantes</h1>
          <p className="text-gray-600">Visualize e gerencie assinantes da plataforma</p>
        </div>

         <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar por email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Assinantes ({filteredSubscribers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                   <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">User ID</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Plano</th>
                      <th className="text-left p-2">Fim da Assinatura</th>
                      <th className="text-left p-2">Data de Criação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{subscriber.email}</td>
                        <td className="p-2 text-xs font-mono">{subscriber.user_id}</td>
                        <td className="p-2">
                          {getSubscriptionBadge(subscriber.subscribed, subscriber.subscription_tier)}
                        </td>
                        <td className="p-2">{subscriber.subscription_tier || 'N/A'}</td>
                        <td className="p-2">
                          {subscriber.subscription_end 
                            ? new Date(subscriber.subscription_end).toLocaleDateString('pt-BR')
                            : 'N/A'
                          }
                        </td>
                        <td className="p-2">
                          {new Date(subscriber.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredSubscribers.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Nenhum assinante encontrado.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSubscribers;