import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Edit, Ban } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ClientLayout from '@/components/layout/ClientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id: string;
  name: string;
  email: string;
  user_type: string;
  created_at: string;
  profile_completed: boolean;
  subscription_tier?: string;
  subscribed?: boolean;
}

export default function AdminUsers() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (profile?.user_type !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    loadUsers();
  }, [profile, navigate]);

  const loadUsers = async () => {
    try {
      const { data: usersData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          user_type,
          created_at,
          profile_completed
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar dados de assinatura
      const { data: subscribersData } = await supabase
        .from('subscribers')
        .select('user_id, subscription_tier, subscribed');

      const subscribersMap = new Map();
      subscribersData?.forEach(sub => {
        subscribersMap.set(sub.user_id, {
          subscription_tier: sub.subscription_tier,
          subscribed: sub.subscribed
        });
      });

      const enrichedUsers = usersData?.map(user => ({
        ...user,
        ...subscribersMap.get(user.id)
      })) || [];

      setUsers(enrichedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'subscribed') return matchesSearch && user.subscribed;
    if (filterType === 'free') return matchesSearch && !user.subscribed;
    
    return matchesSearch && user.user_type === filterType;
  });

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'client': return 'Cliente';
      case 'professional': return 'Profissional';
      case 'admin': return 'Administrador';
      default: return type;
    }
  };

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case 'client': return <Badge variant="secondary">Cliente</Badge>;
      case 'professional': return <Badge variant="default">Profissional</Badge>;
      case 'admin': return <Badge variant="destructive">Admin</Badge>;
      default: return <Badge>{type}</Badge>;
    }
  };

  if (profile?.user_type !== 'admin') {
    return null;
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <Button onClick={() => navigate('/admin')}>Voltar ao Painel</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="client">Clientes</SelectItem>
                  <SelectItem value="professional">Profissionais</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="subscribed">Assinantes</SelectItem>
                  <SelectItem value="free">Plano Gratuito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando usuários...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getUserTypeBadge(user.user_type)}</TableCell>
                      <TableCell>
                        {user.subscribed ? (
                          <Badge variant="default">{user.subscription_tier || 'Ativo'}</Badge>
                        ) : (
                          <Badge variant="outline">Gratuito</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.profile_completed ? (
                          <Badge variant="default">Completo</Badge>
                        ) : (
                          <Badge variant="secondary">Incompleto</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Ban className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}