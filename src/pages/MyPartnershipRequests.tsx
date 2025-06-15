
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
import { Search, Users, MapPin, Calendar, DollarSign, Eye, Send } from 'lucide-react';
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
}

const MyPartnershipRequests = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [collaborationType, setCollaborationType] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (profile?.user_type === 'professional') {
      fetchPartnershipRequests();
    }
  }, [profile]);

  const fetchPartnershipRequests = async () => {
    try {
      // Buscar demandas de parceria criadas por outros profissionais (não pelo usuário atual)
      const { data, error } = await supabase
        .from('partnership_demands')
        .select(`
          *,
          services(name, category),
          profiles(name, avatar_url)
        `)
        .eq('status', 'open')
        .neq('professional_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar solicitações",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error fetching partnership requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCollaborationTypeLabel = (type: string) => {
    const types = {
      complementary: 'Complementar',
      joint: 'Conjunta',
      subcontract: 'Subcontratação'
    };
    return types[type as keyof typeof types] || type;
  };

  const getCollaborationTypeColor = (type: string) => {
    const colors = {
      complementary: 'bg-blue-100 text-blue-800',
      joint: 'bg-green-100 text-green-800',
      subcontract: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`;
    if (min) return `A partir de R$ ${min.toLocaleString()}`;
    if (max) return `Até R$ ${max.toLocaleString()}`;
    return null;
  };

  const handleViewDetails = (requestId: string) => {
    navigate(`/partnerships/${requestId}`);
  };

  const handleApply = (requestId: string) => {
    navigate(`/partnerships/${requestId}/apply`);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = collaborationType === 'all' || request.collaboration_type === collaborationType;
    const matchesCategory = categoryFilter === 'all' || request.services.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = [...new Set(requests.map(r => r.services.category))];

  if (profile?.user_type !== 'professional') {
    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
              <p className="text-gray-600">Apenas profissionais podem visualizar solicitações de parceria.</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Solicitações de Parceria
          </h1>
          <p className="text-gray-600">
            Encontre oportunidades de parceria criadas por outros profissionais
          </p>
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
              
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                {requests.length}
              </CardTitle>
              <p className="text-sm text-gray-600">Total de Solicitações</p>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-600">
                {filteredRequests.length}
              </CardTitle>
              <p className="text-sm text-gray-600">Resultados Filtrados</p>
            </CardHeader>
          </Card>
        </div>

        {/* Lista de Solicitações */}
        {loading ? (
          <div className="text-center py-8">
            <p>Carregando solicitações...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {requests.length === 0 ? 'Nenhuma solicitação encontrada' : 'Nenhum resultado encontrado'}
              </h3>
              <p className="text-gray-600">
                {requests.length === 0 
                  ? 'Não há solicitações de parceria disponíveis no momento.'
                  : 'Tente ajustar os filtros para encontrar solicitações relevantes.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{request.services.category}</Badge>
                        <Badge className={getCollaborationTypeColor(request.collaboration_type)}>
                          {getCollaborationTypeLabel(request.collaboration_type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Por {request.profiles.name}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {request.description}
                  </p>

                  {request.required_skills && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Habilidades Requeridas:</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{request.required_skills}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {request.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                    )}
                    
                    {request.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Até {new Date(request.deadline).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    
                    {formatBudget(request.budget_min, request.budget_max) && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatBudget(request.budget_min, request.budget_max)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewDetails(request.id)} 
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button 
                      onClick={() => handleApply(request.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Candidatar-se
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default MyPartnershipRequests;
