
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ClientLayout from '@/components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, DollarSign, FileText, Loader2 } from 'lucide-react';

const Services = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { services, loading: servicesLoading } = useServices();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_id: '',
    location: '',
    deadline: '',
    budget_min: '',
    budget_max: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para solicitar um serviço",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.service_id) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        service_id: formData.service_id,
        client_id: profile.id,
        location: formData.location || null,
        deadline: formData.deadline || null,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        status: 'open' as const
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Serviço solicitado com sucesso!",
        description: "Sua demanda foi publicada e profissionais poderão se candidatar",
      });

      // Redirecionar para a página do projeto criado
      navigate(`/projects/${data.id}`);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Erro ao solicitar serviço",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (servicesLoading) {
    return (
      <ClientLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitar Serviço</h1>
          <p className="text-gray-600">
            Publique sua demanda de serviço ambiental e receba propostas de profissionais qualificados
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Nova Solicitação de Serviço</span>
            </CardTitle>
            <CardDescription>
              Preencha os detalhes do serviço que você precisa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título do Projeto *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Licenciamento ambiental para indústria"
                  required
                />
              </div>

              {/* Tipo de Serviço */}
              <div className="space-y-2">
                <Label htmlFor="service">Tipo de Serviço *</Label>
                <Select
                  value={formData.service_id}
                  onValueChange={(value) => handleInputChange('service_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.category}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Projeto *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva detalhadamente o que você precisa, objetivos, escopo do trabalho, etc."
                  rows={4}
                  required
                />
              </div>

              {/* Localização */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Localização</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>

              {/* Prazo */}
              <div className="space-y-2">
                <Label htmlFor="deadline" className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Prazo Desejado</span>
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>

              {/* Orçamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_min" className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Orçamento Mínimo (R$)</span>
                  </Label>
                  <Input
                    id="budget_min"
                    type="number"
                    value={formData.budget_min}
                    onChange={(e) => handleInputChange('budget_min', e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_max" className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Orçamento Máximo (R$)</span>
                  </Label>
                  <Input
                    id="budget_max"
                    type="number"
                    value={formData.budget_max}
                    onChange={(e) => handleInputChange('budget_max', e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Informações importantes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Informações Importantes</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Sua solicitação será publicada e profissionais qualificados poderão se candidatar</li>
                  <li>• Você receberá propostas detalhadas e poderá escolher o melhor profissional</li>
                  <li>• Campos marcados com * são obrigatórios</li>
                  <li>• O orçamento é opcional, mas ajuda profissionais a fazer propostas mais precisas</li>
                </ul>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    'Publicar Solicitação'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Services;
