import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  name: string;
  email: string;
  user_type: string;
  profile_completed: boolean;
  created_at: string;
  phone?: string;
  city?: string;
  state?: string;
  company_name?: string;
  experience_years?: number;
}

const AdminProfiles = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [completionFilter, setCompletionFilter] = useState('all');

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profileItem => {
    const matchesSearch = profileItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profileItem.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesType = true;
    if (typeFilter !== 'all') {
      matchesType = profileItem.user_type === typeFilter;
    }

    let matchesCompletion = true;
    if (completionFilter === 'completed') {
      matchesCompletion = profileItem.profile_completed;
    } else if (completionFilter === 'incomplete') {
      matchesCompletion = !profileItem.profile_completed;
    }
    
    return matchesSearch && matchesType && matchesCompletion;
  });

  const getUserTypeBadge = (userType: string) => {
    const typeConfig = {
      'client': { label: 'Cliente', className: 'bg-blue-100 text-blue-800' },
      'professional': { label: 'Profissional', className: 'bg-green-100 text-green-800' },
      'admin': { label: 'Admin', className: 'bg-purple-100 text-purple-800' }
    };
    
    const config = typeConfig[userType as keyof typeof typeConfig] || typeConfig.client;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCompletionIcon = (completed: boolean) => {
    return completed ? (
      <Check className="h-4 w-4 text-green-600" />
    ) : (
      <X className="h-4 w-4 text-red-600" />
    );
  };

  const handleViewProfile = (profileId: string, userType: string) => {
    if (userType === 'professional') {
      navigate(`/professionals/${profileId}`);
    } else {
      // Para clientes e admins, pode implementar uma página de visualização específica
      console.log('Ver perfil:', profileId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Perfis</h1>
          <p className="text-gray-600">Visualize e gerencie perfis de usuários</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="client">Cliente</SelectItem>
              <SelectItem value="professional">Profissional</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={completionFilter} onValueChange={setCompletionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Completos</SelectItem>
              <SelectItem value="incomplete">Incompletos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Perfis ({filteredProfiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Nome</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Tipo</th>
                      <th className="text-left p-2">Completo</th>
                      <th className="text-left p-2">Localização</th>
                      <th className="text-left p-2">Experiência</th>
                      <th className="text-left p-2">Data</th>
                      <th className="text-left p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map((profileItem) => (
                      <tr key={profileItem.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{profileItem.name}</td>
                        <td className="p-2">{profileItem.email}</td>
                        <td className="p-2">{getUserTypeBadge(profileItem.user_type)}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {getCompletionIcon(profileItem.profile_completed)}
                            <span className="text-sm">
                              {profileItem.profile_completed ? 'Sim' : 'Não'}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          {profileItem.city && profileItem.state 
                            ? `${profileItem.city}, ${profileItem.state}`
                            : 'N/A'
                          }
                        </td>
                        <td className="p-2">
                          {profileItem.user_type === 'professional' && profileItem.experience_years
                            ? `${profileItem.experience_years} anos`
                            : 'N/A'
                          }
                        </td>
                        <td className="p-2">
                          {new Date(profileItem.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProfile(profileItem.id, profileItem.user_type)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProfiles.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Nenhum perfil encontrado.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProfiles;