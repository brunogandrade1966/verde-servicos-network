
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, Search, Star, MapPin, DollarSign, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Professional {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  professional_services: Array<{
    id: string;
    price_range?: string;
    experience_years?: number;
    services: {
      name: string;
      category: string;
    };
  }>;
}

interface Service {
  id: string;
  name: string;
  category: string;
}

const FindProfessionals = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProfessionals();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          bio,
          avatar_url,
          professional_services(
            id,
            price_range,
            experience_years,
            services(name, category)
          )
        `)
        .eq('user_type', 'professional');

      if (error) {
        toast({
          title: "Erro ao carregar profissionais",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         professional.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = !selectedService || 
                          professional.professional_services.some(ps => ps.services.name === selectedService);
    
    const matchesCategory = !selectedCategory ||
                           professional.professional_services.some(ps => ps.services.category === selectedCategory);

    return matchesSearch && matchesService && matchesCategory;
  });

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Encontrar Profissionais</h1>
                <p className="text-sm text-gray-500">Conecte-se com especialistas ambientais</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtros de Busca</CardTitle>
            <CardDescription>
              Use os filtros abaixo para encontrar o profissional ideal para seu projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou especialidade..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os serviços</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profissionais Disponíveis
          </h2>
          <p className="text-gray-600">
            {filteredProfessionals.length} profissional{filteredProfessionals.length !== 1 ? 'is' : ''} encontrado{filteredProfessionals.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum profissional encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Tente ajustar os filtros de busca ou remova alguns critérios.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProfessionals.map((professional) => (
              <Card key={professional.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{professional.name}</CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <Star className="h-4 w-4 text-gray-300" />
                          <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                        </div>
                      </div>
                      {professional.bio && (
                        <CardDescription className="text-sm">
                          {professional.bio.length > 120 
                            ? `${professional.bio.substring(0, 120)}...` 
                            : professional.bio
                          }
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Especialidades:</h4>
                      <div className="flex flex-wrap gap-2">
                        {professional.professional_services.map((ps) => (
                          <Badge key={ps.id} variant="outline">
                            {ps.services.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-gray-600">
                        {professional.professional_services.length > 0 && 
                         professional.professional_services[0].experience_years && (
                          <span>{professional.professional_services[0].experience_years} anos de experiência</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Ver Perfil
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Contratar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FindProfessionals;
