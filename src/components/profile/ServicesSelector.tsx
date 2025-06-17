
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface ProfessionalService {
  id: string;
  service_id: string;
  experience_years: number;
  price_range: string;
}

interface ServicesSelectorProps {
  professionalId: string;
  onServicesChange?: (services: ProfessionalService[]) => void;
}

const SERVICES_PER_PAGE = 9;

const ServicesSelector = ({ professionalId, onServicesChange }: ServicesSelectorProps) => {
  const { services, loading: servicesLoading } = useServices();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [professionalServices, setProfessionalServices] = useState<ProfessionalService[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfessionalServices();
  }, [professionalId]);

  const fetchProfessionalServices = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_services')
        .select('*')
        .eq('professional_id', professionalId);

      if (error) {
        console.error('Error fetching professional services:', error);
        return;
      }

      setProfessionalServices(data || []);
      setSelectedServices(new Set(data?.map(ps => ps.service_id) || []));
    } catch (error) {
      console.error('Error in fetchProfessionalServices:', error);
    }
  };

  const handleServiceToggle = async (serviceId: string, checked: boolean) => {
    setLoading(true);
    try {
      if (checked) {
        // Adicionar serviço
        const { error } = await supabase
          .from('professional_services')
          .insert({
            professional_id: professionalId,
            service_id: serviceId,
            experience_years: 0,
            price_range: ''
          });

        if (error) {
          toast({
            title: "Erro ao adicionar serviço",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        setSelectedServices(prev => new Set([...prev, serviceId]));
      } else {
        // Remover serviço
        const { error } = await supabase
          .from('professional_services')
          .delete()
          .eq('professional_id', professionalId)
          .eq('service_id', serviceId);

        if (error) {
          toast({
            title: "Erro ao remover serviço",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        setSelectedServices(prev => {
          const newSet = new Set(prev);
          newSet.delete(serviceId);
          return newSet;
        });
      }

      await fetchProfessionalServices();
      if (onServicesChange) {
        onServicesChange(professionalServices);
      }
    } catch (error) {
      console.error('Error toggling service:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar serviços por termo de busca e categoria
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginação
  const totalPages = Math.ceil(filteredServices.length / SERVICES_PER_PAGE);
  const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + SERVICES_PER_PAGE);

  // Obter categorias únicas
  const categories = [...new Set(services.map(service => service.category))];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (servicesLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Serviços Oferecidos</h3>
        <p className="text-gray-600">Selecione os serviços que você está habilitado a oferecer</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-48">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedServices.has(service.id)}
                    onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                    disabled={loading}
                  />
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {service.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3">
                {service.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a {Math.min(startIndex + SERVICES_PER_PAGE, filteredServices.length)} de {filteredServices.length} serviços
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum serviço encontrado
            </h3>
            <p className="text-gray-500">
              Não encontramos serviços que correspondam aos seus critérios de busca.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedServices.size > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            {selectedServices.size} serviço{selectedServices.size !== 1 ? 's' : ''} selecionado{selectedServices.size !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesSelector;
