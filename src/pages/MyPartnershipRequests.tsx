
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, MapPin, Calendar, DollarSign, Eye, Edit, Plus } from 'lucide-react';
import ClientLayout from '@/components/layout/ClientLayout';

interface PartnershipRequest {
  id: string;
  title: string;
  description: string;
  collaboration_type: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  required_skills?: string;
  created_at: string;
  status: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
    avatar_url?: string;
  };
  partnership_applications: Array<{
    id: string;
    status: string;
  }>;
}

const MyPartnershipRequests = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [collaborationType, setCollaborationType] = useState('all');

  useEffect(() => {
    if (profile?.user_type === 'professional') {
      fetchMyPartnershipRequests();
    }
  }, [profile]);

  const fetchMyPartnershipRequests = async () => {
    try {
      // Buscar demandas de parceria criadas pelo usuário atual
      const { data, error } = await supabase
        .from('partnership_demands')
        .select(`
          *,
          services(name, category),
          profiles(name, avatar_url),
          partnership_applications(id, status)
        `)
        .eq('professional_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar suas solicitações",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error fetching my partnership requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const statuses = {
      open: 'Aberta',
      in_progress: 'Em Andamento',
      completed: 'Concluída',
      cancelled: 'Cancelada'
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCollaborationTypeLabel = (type: string) => {
    const types = {
      complementary: 'Complementar',
      joint: 'Conjunta',
      subcontract: 'Subcontratação'
    };
    return types[type as keyof typeof types] || type;
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return 'Não informado';
    if (min && max) return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`;
    if (min) return `A partir de R$ ${min.toLocaleString()}`;
    if (max) return `Até R$ ${max.toLocaleString()}`;
    return 'Não informado';
  };

  const getCandidatesCount = (applications: Array<{id: string, status: string}>) => {
    return applications.filter(app => app.status === 'pending').length;
  };

  const handleViewDetails = (requestId: string) => {
    navigate(`/partnerships/${requestId}`);
  };

  const handleViewCandidates = (requestId: string) => {
    navigate(`/partnerships/${requestId}/candidates`);
  };

  const handleCreateNew = () => {
    navigate('/partnerships/create');
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = collaborationType === 'all' || request.collaboration_type === collaborationType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (profile?.user_type !== 'professional') {
    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
              <p className="text-gray-600">Apenas profissionais podem visualizar suas solicitações de parceria.</p>
            </CardContent>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Minhas Solicitações de Parceria
            </h1>
            <p className="text-gray-600">
              Gerencie suas solicitações de parceria criadas
            </p>
          </div>
          <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Solicitação de Parceria
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Buscar</label>
                <Input
                  placeholder="Título, descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="open">Aberta</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Colaboração</label>
                <Select value={collaborationType} onValueChange={setCollaborationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="complementary">Complementar</SelectItem>
                    <SelectItem value="joint">Conjunta</SelectItem>
                    <SelectItem value="subcontract">Subcontratação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-600">
                {requests.length}
              </CardTitle>
              <p className="text-sm text-gray-600">Total de Solicitações</p>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'open').length}
              </CardTitle>
              <p className="text-sm text-gray-600">Solicitações Abertas</p>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-orange-600">
                {requests.reduce((acc, r) => acc + getCandidatesCount(r.partnership_applications), 0)}
              </CardTitle>
              <p className="text-sm text-gray-600">Candidatos Pendentes</p>
            </CardHeader>
          </Card>
        </div>

        {/* Tabela de Solicitações */}
        {loading ? (
          <div className="text-center py-8">
            <p>Carregando suas solicitações...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {requests.length === 0 ? 'Nenhuma solicitação criada' : 'Nenhum resultado encontrado'}
              </h3>
              <p className="text-gray-600 mb-4">
                {requests.length === 0 
                  ? 'Você ainda não criou nenhuma solicitação de parceria.'
                  : 'Tente ajustar os filtros para encontrar suas solicitações.'}
              </p>
              {requests.length === 0 && (
                <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Solicitação
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Parceiro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Meu Papel</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {request.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.services.name}</div>
                          <div className="text-sm text-gray-500">
                            {getCollaborationTypeLabel(request.collaboration_type)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {request.status === 'open' ? 'Aguardando seleção' : 'Parceiro selecionado'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Solicitante
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {getCandidatesCount(request.partnership_applications) > 0 && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewCandidates(request.id)}
                              className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                            >
                              <Users className="h-4 w-4 mr-1" />
                              Ver Candidatos
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(request.id)}
                            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
};

export default MyPartnershipRequests;
