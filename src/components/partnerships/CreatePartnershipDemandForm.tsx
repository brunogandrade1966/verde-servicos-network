import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Service {
  id: string;
  name: string;
  category: string;
}

interface PartnershipDemandData {
  title: string;
  description: string;
  service_id: string;
  required_skills: string;
  collaboration_type: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
}

interface CreatePartnershipDemandFormProps {
  preselectedServiceId?: string | null;
}

const CreatePartnershipDemandForm = ({ preselectedServiceId }: CreatePartnershipDemandFormProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<PartnershipDemandData>({
    defaultValues: {
      title: '',
      description: '',
      service_id: preselectedServiceId || '',
      required_skills: '',
      collaboration_type: '',
      budget_min: undefined,
      budget_max: undefined,
      deadline: '',
      location: ''
    }
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (preselectedServiceId) {
      form.setValue('service_id', preselectedServiceId);
    }
  }, [preselectedServiceId, form]);

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
      } else {
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const onSubmit = async (data: PartnershipDemandData) => {
    if (!profile?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma demanda de parceria",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const partnershipData = {
        ...data,
        professional_id: profile.id,
        budget_min: data.budget_min || null,
        budget_max: data.budget_max || null,
        deadline: data.deadline || null,
        location: data.location || null
      };

      const { error } = await supabase
        .from('partnership_demands')
        .insert([partnershipData]);

      if (error) {
        toast({
          title: "Erro ao criar demanda de parceria",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Demanda de parceria criada!",
          description: "Sua demanda foi publicada com sucesso."
        });
        navigate('/partnerships');
      }
    } catch (error) {
      console.error('Error creating partnership demand:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.user_type !== 'professional') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600">Apenas profissionais podem criar demandas de parceria.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Criar Demanda de Parceria</CardTitle>
          <p className="text-gray-600">
            Publique uma demanda para encontrar profissionais parceiros para trabalhos colaborativos
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Título é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Demanda</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Parceria para Licenciamento Ambiental" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Descrição é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Detalhada</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o projeto, objetivos, responsabilidades e perfil do parceiro ideal..."
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service_id"
                rules={{ required: "Categoria é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria do Serviço</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {service.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collaboration_type"
                rules={{ required: "Tipo de colaboração é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Colaboração</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="complementary">Complementar - Habilidades que se complementam</SelectItem>
                        <SelectItem value="joint">Conjunta - Trabalho em equipe no mesmo projeto</SelectItem>
                        <SelectItem value="subcontract">Subcontratação - Terceirizar parte específica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="required_skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Habilidades/Especialidades Requeridas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ex: Experiência em EIA/RIMA, conhecimento em fauna, certificação em ISO 14001..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budget_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orçamento Mínimo (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0,00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orçamento Máximo (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0,00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: São Paulo, SP ou Remoto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/partnerships/create')}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Criando...' : 'Publicar Demanda'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePartnershipDemandForm;
