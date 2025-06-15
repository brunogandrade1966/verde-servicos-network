
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, DollarSign, Users, Search, Plus } from 'lucide-react';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

interface MyDemand {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  services: {
    name: string;
    category: string;
  };
  _count?: {
    applications: number;
  };
}

const MyDemands = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [demands, setDemands] = useState<MyDemand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMyDemands();
  }, [profile]);

  const fetchMyDemands = async () => {
    if (!profile?.id) return;

    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          services(name, category)
        `)
        .eq('client_id', profile.id)
        .in('status', ['draft', 'open']) // Apenas demandas em aberto
        .order('updated_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Erro ao carregar demandas",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Buscar contagem de aplicações para cada demanda
      const demandsWithCounts = await Promise.all(
        (data || []).map(async (demand) => {
          const { count } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', demand.id);

          return {
            ...demand,
            _count: {
              applications: count || 0
            }
          };
        })
      );

      setDemands(demandsWithCounts);
    } catch (error) {
      console.error('Error fetching demands:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDemands = demands.filter(demand => {
    const matchesSearch = demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demand.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return 'Orçamento a combinar';
    if (min && max) return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`;
    if (min) return `A partir de R$ ${min.toLocaleString()}`;
    if (max) return `Até R$ ${max.toLocaleString()}`;
    return 'Orçamento a combinar';
  };

  const getStatusStats = () => {
    const stats = {
      total: demands.length,
      draft: demands.filter(d => d.status === 'draft').length,
      open: demands.filter(d => d.status === 'open').length,
    };
    return stats;
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </ClientLayout>
    );
  }

  const stats = getStatusStats();

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Demandas</h1>
            <p className="text-gray-600">Demandas em rascunho e abertas para candidaturas</p>
          </div>
          <Button onClick={() => navigate('/services')} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Demanda
          </Button>
        </div>

        {/* Header com estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total de Demandas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
              <div className="text-sm text-gray-500">Rascunhos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
              <div className="text-sm text-gray-500">Abertas</div>
            </CardContent>
          </Card>
        </div>

        {/* Busca */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar demandas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de demandas */}
        {filteredDemands.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {demands.length === 0 ? 'Nenhuma demanda criada ainda' : 'Nenhuma demanda encontrada'}
              </h3>
              <p className="text-gray-500 mb-4">
                {demands.length === 0 
                  ? 'Comece criando sua primeira demanda de serviço ambiental'
                  : 'Tente ajustar a busca para encontrar suas demandas'
                }
              </p>
              {demands.length === 0 && (
                <Button onClick={() => navigate('/services')} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Demanda
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDemands.map((demand) => (
              <Card key={demand.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {demand.title}
                    </CardTitle>
                    <ProjectStatusBadge status={demand.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{demand.services.category}</Badge>
                    <span>•</span>
                    <span>{demand.services.name}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {demand.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {demand.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{demand.location}</span>
                      </div>
                    )}
                    
                    {demand.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Até {new Date(demand.deadline).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatBudget(demand.budget_min, demand.budget_max)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{demand._count?.applications || 0} candidatura(s)</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    <p>Criado em: {new Date(demand.created_at).toLocaleDateString('pt-BR')}</p>
                    <p>Atualizado em: {new Date(demand.updated_at).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate(`/projects/${demand.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Ver Detalhes
                    </Button>
                    {demand._count && demand._count.applications > 0 && (
                      <Button 
                        onClick={() => navigate(`/applications?project=${demand.id}`)}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Ver Candidaturas
                      </Button>
                    )}
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

export default MyDemands;
