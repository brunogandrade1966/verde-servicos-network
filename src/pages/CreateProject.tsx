
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, ArrowLeft, Save, DollarSign, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
}

const CreateProject = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_id: '',
    budget_min: '',
    budget_max: '',
    deadline: '',
    location: '',
    status: 'draft' as const
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        toast({
          title: "Erro ao carregar serviços",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (isDraft: boolean = true) => {
    if (!profile) return;

    setLoading(true);

    // Validações básicas
    if (!formData.title.trim()) {
      toast({
        title: "Erro de validação",
        description: "O título do projeto é obrigatório",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Erro de validação",
        description: "A descrição do projeto é obrigatória",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!formData.service_id) {
      toast({
        title: "Erro de validação",
        description: "Selecione um tipo de serviço",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const projectData = {
        client_id: profile.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        service_id: formData.service_id,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        deadline: formData.deadline || null,
        location: formData.location.trim() || null,
        status: isDraft ? 'draft' : 'open'
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao criar projeto",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Projeto criado com sucesso!",
        description: isDraft ? "Projeto salvo como rascunho" : "Projeto publicado e disponível para candidaturas"
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar o projeto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

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
                <h1 className="text-xl font-bold text-gray-900">Criar Novo Projeto</h1>
                <p className="text-sm text-gray-500">Descreva seu projeto ambiental</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Projeto</CardTitle>
            <CardDescription>
              Preencha os detalhes do seu projeto ambiental para encontrar os profissionais ideais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título do Projeto *</Label>
              <Input
                id="title"
                placeholder="Ex: Licenciamento ambiental para construção de galpão industrial"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição Detalhada *</Label>
              <Textarea
                id="description"
                placeholder="Descreva em detalhes o que você precisa, incluindo localização, prazo, requisitos específicos..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            {/* Tipo de Serviço */}
            <div className="space-y-2">
              <Label htmlFor="service">Tipo de Serviço *</Label>
              <Select onValueChange={(value) => handleInputChange('service_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de serviço ambiental" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groupedServices).map(([category, categoryServices]) => (
                    <div key={category}>
                      <div className="px-2 py-1 text-sm font-medium text-gray-500 bg-gray-50">
                        {category}
                      </div>
                      {categoryServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Orçamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_min">Orçamento Mínimo (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="budget_min"
                    type="number"
                    placeholder="0,00"
                    className="pl-10"
                    value={formData.budget_min}
                    onChange={(e) => handleInputChange('budget_min', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget_max">Orçamento Máximo (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="budget_max"
                    type="number"
                    placeholder="0,00"
                    className="pl-10"
                    value={formData.budget_max}
                    onChange={(e) => handleInputChange('budget_max', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Prazo e Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo Desejado</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="deadline"
                    type="date"
                    className="pl-10"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Cidade, Estado"
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Rascunho
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  'Publicar Projeto'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateProject;
