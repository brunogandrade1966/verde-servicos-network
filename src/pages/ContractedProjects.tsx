import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ContractedProjectsGrid from '@/components/projects/ContractedProjectsGrid';
import ContractedProjectsEmpty from '@/components/projects/ContractedProjectsEmpty';
import ClientLayout from '@/components/layout/ClientLayout';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

interface ContractedProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
  };
}

const ContractedProjects = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ContractedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractedProjects();
  }, [profile]);

  const fetchContractedProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          services(name, category),
          profiles(name)
        `)
        .in('status', ['in_progress', 'completed'])
        .order('updated_at', { ascending: false });

      // Filtrar baseado no tipo de usuário
      if (profile?.user_type === 'client') {
        query = query.eq('client_id', profile.id);
      } else if (profile?.user_type === 'professional') {
        // Para profissionais, buscar projetos onde eles foram contratados
        // Isso requer uma junção com a tabela applications
        const { data: applications } = await supabase
          .from('applications')
          .select('project_id')
          .eq('professional_id', profile.id)
          .eq('status', 'accepted');

        if (applications && applications.length > 0) {
          const projectIds = applications.map(app => app.project_id);
          query = query.in('id', projectIds);
        } else {
          setProjects([]);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Erro ao carregar projetos",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching contracted projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
      {projects.length === 0 ? (
        <ContractedProjectsEmpty userType={profile?.user_type} />
      ) : (
        <ContractedProjectsGrid 
          projects={projects} 
          userType={profile?.user_type} 
        />
      )}
    </ClientLayout>
  );
};

export default ContractedProjects;
