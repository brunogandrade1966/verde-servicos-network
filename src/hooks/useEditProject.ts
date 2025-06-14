
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface FormData {
  title: string;
  description: string;
  service_id: string;
  budget_min: string;
  budget_max: string;
  deadline: string;
  location: string;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
}

export const useEditProject = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    service_id: '',
    budget_min: '',
    budget_max: '',
    deadline: '',
    location: '',
    status: 'draft' as 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
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
        status: data.status as 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
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

  return {
    project,
    formData,
    loading,
    loadingProject,
    handleInputChange,
    handleSubmit
  };
};
