
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface PartnershipDemand {
  id: string;
  title: string;
  collaboration_type: string;
  profiles: {
    name: string;
  };
}

interface ApplicationData {
  proposal: string;
  proposed_price?: number;
  estimated_duration: string;
}

const ApplyToPartnership = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [demand, setDemand] = useState<PartnershipDemand | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<ApplicationData>({
    defaultValues: {
      proposal: '',
      proposed_price: undefined,
      estimated_duration: ''
    }
  });

  useEffect(() => {
    if (id) {
      fetchPartnershipDemand();
    }
  }, [id]);

  const fetchPartnershipDemand = async () => {
    try {
      const { data, error } = await supabase
        .from('partnership_demands')
        .select(`
          id,
          title,
          collaboration_type,
          profiles(name)
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Erro ao carregar demanda",
          description: error.message,
          variant: "destructive"
        });
        navigate('/partnerships');
      } else {
        setDemand(data);
      }
    } catch (error) {
      console.error('Error fetching partnership demand:', error);
    }
  };

  const onSubmit = async (data: ApplicationData) => {
    if (!profile?.id || !id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para se candidatar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const applicationData = {
        partnership_demand_id: id,
        professional_id: profile.id,
        proposal: data.proposal,
        proposed_price: data.proposed_price || null,
        estimated_duration: data.estimated_duration
      };

      const { error } = await supabase
        .from('partnership_applications')
        .insert([applicationData]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Candidatura já enviada",
            description: "Você já se candidatou a esta demanda de parceria",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro ao enviar candidatura",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Candidatura enviada!",
          description: "Sua proposta de parceria foi enviada com sucesso."
        });
        navigate(`/partnerships/${id}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!demand) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/partnerships/${id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Candidatar-se à Parceria</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{demand.title}</CardTitle>
            <p className="text-gray-600">Profissional: {demand.profiles.name}</p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sua Proposta de Parceria</CardTitle>
            <p className="text-gray-600">
              Detalhe como você pode contribuir para este projeto e os termos da parceria
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="proposal"
                  rules={{ required: "Proposta é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição da Proposta</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva sua experiência relevante, como você pode contribuir para o projeto, sua abordagem para a colaboração..."
                          rows={8}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proposed_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Proposto (R$) - Opcional</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0,00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500">
                        Valor que você propõe para sua participação no projeto
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimated_duration"
                  rules={{ required: "Duração estimada é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração Estimada</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 2 semanas, 1 mês, 3 meses..."
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500">
                        Tempo estimado para sua contribuição no projeto
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/partnerships/${id}`)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {loading ? 'Enviando...' : 'Enviar Candidatura'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplyToPartnership;
