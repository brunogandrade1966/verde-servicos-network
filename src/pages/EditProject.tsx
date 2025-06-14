
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useServices } from '@/hooks/useServices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectFormFields } from '@/components/project/ProjectFormFields';
import { ProjectFormActions } from '@/components/project/ProjectFormActions';
import { EditProjectHeader } from '@/components/project/EditProjectHeader';

interface Project {
  id: string;
  title: string;
  description: string;
  service_id: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  status: string;
  client_id: string;
}

const EditProject = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: services = [] } = useServices();
  
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
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
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Erro ao carregar demanda",
          description: error.message,
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }

      if (data.client_id !== profile?.id) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para editar esta demanda",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }

      setProject(data);
      setFormData({
        title: data.title,
        description: data.description,
        service_id: data.service_id,
        budget_min: data.budget_min ? data.budget_min.toString() : '',
        budget_max: data.budget_max ? data.budget_max.toString() : '',
        deadline: data.deadline || '',
        location: data.location || '',
        status: data.status
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar a demanda",
        variant: "destructive"
      });
      navigate('/dashboard');
    } finally {
      setLoadingProject(false);
    }
  };

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
        title: formData.title.trim(),
        description: formData.description.trim(),
        service_id: formData.service_id,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        deadline: formData.deadline || null,
        location: formData.location.trim() || null,
        status: (isDraft ? 'draft' : 'open') as 'draft' | 'open'
      };

      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao atualizar demanda",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Demanda atualizada com sucesso!",
        description: isDraft ? "Demanda salva como rascunho" : "Demanda publicada e disponível para candidaturas"
      });

      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao atualizar a demanda",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Demanda não encontrada
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <EditProjectHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Editar Demanda</CardTitle>
            <CardDescription>
              Atualize os detalhes da sua demanda ambiental
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
      </main>
    </div>
  );
};

export default EditProject;
