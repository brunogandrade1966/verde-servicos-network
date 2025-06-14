import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProjectDetailsHeader from '@/components/projects/ProjectDetailsHeader';
import ProjectInfo from '@/components/projects/ProjectInfo';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectApplications from '@/components/projects/ProjectApplications';
import ProjectTimeline from '@/components/projects/ProjectTimeline';
import ClientLayout from '@/components/layout/ClientLayout';

interface Project {
  id: string;
  title: string;
  description: string;
  location?: string;
  deadline?: string;
  budget_min?: number;
  budget_max?: number;
  created_at: string;
  client_id: string;
  service_id: string;
  status: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
  };
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
      checkIfApplied(id);
    }
  }, [id, profile]);

  const fetchProjectDetails = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          services(name, category),
          profiles(name)
        `)
        .eq('id', projectId)
        .single();

      if (error) {
        toast({
          title: "Erro ao carregar projeto",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setProject(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async (projectId: string) => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('project_id', projectId)
        .eq('professional_id', profile.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking application:', error);
        return;
      }

      setHasApplied(!!data);
    } catch (error) {
      console.error('Error checking application:', error);
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

  if (!project) {
    return (
      <ClientLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Projeto não encontrado
          </h3>
          <p className="text-gray-500">
            O projeto que você está procurando não existe ou foi removido.
          </p>
        </div>
      </ClientLayout>
    );
  }

  const isOwner = profile?.id === project.client_id;
  const canApply = profile?.user_type === 'professional' && 
                   project.status === 'open' && 
                   !hasApplied && 
                   !isOwner;

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto">
        <ProjectDetailsHeader 
          project={project}
          isOwner={isOwner}
          canApply={canApply}
          hasApplied={hasApplied}
          onApply={() => navigate(`/apply/${project.id}`)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <ProjectInfo project={project} />
            
            {isOwner && (
              <ProjectApplications projectId={project.id} />
            )}
            
            <ProjectTimeline projectId={project.id} />
          </div>

          <div className="lg:col-span-1">
            <ProjectSidebar 
              project={project}
              isOwner={isOwner}
              canApply={canApply}
              hasApplied={hasApplied}
              onApply={() => navigate(`/apply/${project.id}`)}
            />
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ProjectDetails;
