
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Leaf, ArrowLeft, Plus, Trash2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useServices } from '@/hooks/useServices';

interface ProfessionalService {
  id: string;
  service_id: string;
  experience_years: number;
  price_range: string;
  services: {
    name: string;
    category: string;
  };
}

const ManageServices = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { services } = useServices();
  const [professionalServices, setProfessionalServices] = useState<ProfessionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newService, setNewService] = useState({
    service_id: '',
    experience_years: 0,
    price_range: ''
  });

  useEffect(() => {
    fetchProfessionalServices();
  }, [profile]);

  const fetchProfessionalServices = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('professional_services')
        .select(`
          *,
          services(name, category)
        `)
        .eq('professional_id', profile.id);

      if (error) {
        toast({
          title: "Erro ao carregar serviços",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setProfessionalServices(data || []);
    } catch (error) {
      console.error('Error fetching professional services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!profile || !newService.service_id) return;

    setAdding(true);
    try {
      const { error } = await supabase
        .from('professional_services')
        .insert({
          professional_id: profile.id,
          service_id: newService.service_id,
          experience_years: newService.experience_years,
          price_range: newService.price_range
        });

      if (error) {
        toast({
          title: "Erro ao adicionar serviço",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Serviço adicionado!",
        description: "O serviço foi adicionado ao seu perfil."
      });

      setNewService({
        service_id: '',
        experience_years: 0,
        price_range: ''
      });

      fetchProfessionalServices();
    } catch (error) {
      console.error('Error adding service:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('professional_services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        toast({
          title: "Erro ao remover serviço",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Serviço removido!",
        description: "O serviço foi removido do seu perfil."
      });

      fetchProfessionalServices();
    } catch (error) {
      console.error('Error removing service:', error);
    }
  };

  const availableServices = services.filter(service => 
    !professionalServices.some(ps => ps.service_id === service.id)
  );

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
                <h1 className="text-xl font-bold text-gray-900">Meus Serviços</h1>
                <p className="text-sm text-gray-500">Gerencie os serviços que você oferece</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add New Service */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Adicionar Serviço</span>
            </CardTitle>
            <CardDescription>
              Adicione um novo serviço ao seu perfil profissional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="service">Serviço</Label>
                <Select value={newService.service_id} onValueChange={(value) => 
                  setNewService(prev => ({ ...prev, service_id: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience">Anos de Experiência</Label>
                <Input
                  id="experience"
                  type="number"
                  value={newService.experience_years}
                  onChange={(e) => setNewService(prev => ({ 
                    ...prev, 
                    experience_years: parseInt(e.target.value) || 0 
                  }))}
                  min="0"
                  max="50"
                />
              </div>

              <div>
                <Label htmlFor="price">Faixa de Preço</Label>
                <Input
                  id="price"
                  value={newService.price_range}
                  onChange={(e) => setNewService(prev => ({ 
                    ...prev, 
                    price_range: e.target.value 
                  }))}
                  placeholder="R$ 1.000 - R$ 5.000"
                />
              </div>
            </div>

            <Button 
              onClick={handleAddService}
              disabled={adding || !newService.service_id}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {adding ? 'Adicionando...' : 'Adicionar Serviço'}
            </Button>
          </CardContent>
        </Card>

        {/* Current Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Serviços Cadastrados</span>
            </CardTitle>
            <CardDescription>
              {professionalServices.length} serviço{professionalServices.length !== 1 ? 's' : ''} cadastrado{professionalServices.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : professionalServices.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum serviço cadastrado
                </h3>
                <p className="text-gray-500">
                  Adicione serviços ao seu perfil para receber mais oportunidades.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {professionalServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{service.services.name}</h3>
                        <Badge variant="outline">{service.services.category}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{service.experience_years} anos de experiência</span>
                        {service.price_range && (
                          <span>{service.price_range}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveService(service.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ManageServices;
