
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectFormFields } from './ProjectFormFields';
import { ProjectFormActions } from './ProjectFormActions';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface ProjectFormProps {
  services: Service[];
  profileId: string;
  onSuccess: () => void;
}

export const ProjectForm = ({ services, profileId, onSuccess }: ProjectFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erro de validação",
        description: "O título da demanda é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Erro de validação",
        description: "A descrição da demanda é obrigatória",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.service_id) {
      toast({
        title: "Erro de validação",
        description: "Selecione um tipo de serviço",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (isDraft: boolean = true) => {
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const projectData = {
        client_id: profileId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        service_id: formData.service_id,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        deadline: formData.deadline || null,
        location: formData.location.trim() || null,
        status: (isDraft ? 'draft' : 'open') as 'draft' | 'open'
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao criar demanda",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Demanda criada com sucesso!",
        description: isDraft ? "Demanda salva como rascunho" : "Demanda publicada e disponível para candidaturas"
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar a demanda",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Demanda</CardTitle>
        <CardDescription>
          Preencha os detalhes da sua demanda ambiental para encontrar os profissionais ideais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProjectFormFields
          formData={formData}
          services={services}
          onInputChange={handleInputChange}
        />
        <ProjectFormActions
          loading={loading}
          onSaveDraft={() => handleSubmit(true)}
          onPublish={() => handleSubmit(false)}
        />
      </CardContent>
    </Card>
  );
};
