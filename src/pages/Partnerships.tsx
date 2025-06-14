
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Users } from 'lucide-react';
import PartnershipDemandCard from '@/components/partnerships/PartnershipDemandCard';

interface PartnershipDemand {
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

const Partnerships = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [demands, setDemands] = useState<PartnershipDemand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [collaborationType, setCollaborationType] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchPartnershipDemands();
  }, []);

  const fetchPartnershipDemands = async () => {
    try {
      let query = supabase
        .from('partnership_demands')
        .select(`
          *,
          services(name, category),
          profiles(name, avatar_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Erro ao carregar demandas de parceria",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setDemands(data || []);
      }
    } catch (error) {
      console.error('Error fetching partnership demands:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDemands = demands.filter(demand => {
    const matchesSearch = demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demand.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = collaborationType === 'all' || demand.collaboration_type === collaborationType;
    const matchesCategory = categoryFilter === 'all' || demand.services.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = [...new Set(demands.map(d => d.services.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Parcerias Profissionais
            </h1>
            <p className="text-gray-600">
              Encontre profissionais para trabalhos colaborativos e forme parcerias estratégicas
            </p>
          </div>
          
          {profile?.user_type === 'professional' && (
            <Button
              onClick={() => navigate('/partnerships/create')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Demanda
            </Button>
          )}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                {demands.length}
              </CardTitle>
              <p className="text-sm text-gray-600">Demandas Ativas</p>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-600">
                {filteredDemands.length}
              </CardTitle>
              <p className="text-sm text-gray-600">Resultados Filtrados</p>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-purple-600">
                {categories.length}
              </CardTitle>
              <p className="text-sm text-gray-600">Categorias Disponíveis</p>
            </CardHeader>
          </Card>
        </div>

        {/* Lista de Demandas */}
        {loading ? (
          <div className="text-center py-8">
            <p>Carregando demandas de parceria...</p>
          </div>
        ) : filteredDemands.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {demands.length === 0 ? 'Nenhuma demanda encontrada' : 'Nenhum resultado encontrado'}
              </h3>
              <p className="text-gray-600 mb-4">
                {demands.length === 0 
                  ? 'Seja o primeiro a criar uma demanda de parceria!'
                  : 'Tente ajustar os filtros para encontrar demandas relevantes.'}
              </p>
              {profile?.user_type === 'professional' && demands.length === 0 && (
                <Button
                  onClick={() => navigate('/partnerships/create')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Demanda
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDemands.map((demand) => (
              <PartnershipDemandCard
                key={demand.id}
                demand={demand}
                showApplyButton={profile?.user_type === 'professional' && profile?.id !== demand.profiles.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Partnerships;
