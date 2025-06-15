
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import ClientLayout from '@/components/layout/ClientLayout';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
}

const CreatePartnership = () => {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { services, loading: servicesLoading } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  console.log('CreatePartnership - profile:', profile, 'authLoading:', authLoading);
  console.log('CreatePartnership - services:', services, 'servicesLoading:', servicesLoading);

  useEffect(() => {
    if (services) {
      console.log('Filtering services with searchTerm:', searchTerm);
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('Filtered services:', filtered);
      setFilteredServices(filtered);
    }
  }, [services, searchTerm]);

  const handleServiceSelect = (serviceId: string) => {
    console.log('Service selected:', serviceId);
    navigate(`/partnerships/create-form?serviceId=${serviceId}`);
  };

  // Loading state
  if (authLoading || servicesLoading) {
    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  // Access restriction
  if (profile?.user_type !== 'professional') {
    console.log('Access denied - user type:', profile?.user_type);
    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
              <p className="text-gray-600">Apenas profissionais podem criar solicitações de parceria.</p>
            </CardContent>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  console.log('Rendering main content');

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Publicar Solicitação de Parceria
            </h1>
            <Button
              onClick={() => navigate('/partnerships/create-form')}
              variant="outline"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Parceria
            </Button>
          </div>
          <p className="text-gray-600">
            Escolha o serviço ambiental para o qual você deseja encontrar um parceiro
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Services Grid */}
        {!services || services.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Nenhum serviço cadastrado</h3>
              <p className="text-gray-600 mb-4">
                Ainda não há serviços cadastrados no sistema.
              </p>
              <Button
                onClick={() => navigate('/partnerships/create-form')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Parceria Personalizada
              </Button>
            </CardContent>
          </Card>
        ) : filteredServices.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Nenhum serviço encontrado</h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os termos de busca ou criar uma parceria personalizada.
              </p>
              <Button
                onClick={() => navigate('/partnerships/create-form')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Parceria Personalizada
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                    {service.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    {service.category}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description || 'Sem descrição disponível'}
                  </p>
                  <Button
                    onClick={() => handleServiceSelect(service.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Solicitar Parceria
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default CreatePartnership;
