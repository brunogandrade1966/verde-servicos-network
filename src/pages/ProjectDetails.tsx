
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProjectDetailsHeader from '@/components/projects/ProjectDetailsHeader';
import ProjectInfo from '@/components/projects/ProjectInfo';
import ProjectApplications from '@/components/projects/ProjectApplications';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectStatusUpdater from '@/components/projects/ProjectStatusUpdater';
import ProjectTimeline from '@/components/projects/ProjectTimeline';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
  };
  applications: Application[];
}

interface Application {
  id: string;
  proposed_price?: number;
  proposal: string;
  status: string;
  estimated_duration?: string;
  created_at: string;
  profiles: {
    name: string;
    bio?: string;
    avatar_url?: string;
  };
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          services(name, category),
          profiles(name),
          applications(
            id,
            proposed_price,
            proposal,
            status,
            estimated_duration,
            created_at,
            profiles(name, bio, avatar_url)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Erro ao carregar demanda",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Se o usuário é profissional, não mostrar as candidaturas de outros profissionais
      if (profile?.user_type === 'professional' && data) {
        data.applications = [];
      }

      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = () => {
    fetchProject(); // Recarregar dados do projeto após atualização de status
  };

  const isOwner = profile?.id === project?.client_id;
  const isContractedStatus = project?.status && ['contracted', 'in_progress', 'completed'].includes(project.status);

  // Criar timeline mock - em uma implementação completa, isso viria do banco de dados
  const createTimelineEvents = (project: Project) => {
    const events = [
      { status: 'draft', date: project.created_at },
      { status: 'open', date: project.created_at }
    ];

    if (isContractedStatus) {
      events.push({ status: 'contracted', date: project.updated_at });
    }

    if (project.status === 'in_progress') {
      events.push({ status: 'in_progress', date: project.updated_at });
    }

    if (project.status === 'completed') {
      events.push({ status: 'completed', date: project.updated_at });
    }

    return events;
  };

  if (loading) {
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
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <ProjectDetailsHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProjectInfo project={project} />
            
            {/* Timeline do projeto para projetos contratados */}
            {isContractedStatus && (
              <ProjectTimeline 
                events={createTimelineEvents(project)}
                currentStatus={project.status}
              />
            )}

            {/* Só mostrar candidaturas se o usuário for o cliente dono da demanda */}
            {profile?.user_type === 'client' && profile?.id === project.client_id && (
              <ProjectApplications applications={project.applications} profile={profile} />
            )}
          </div>
          
          <div className="space-y-6">
            <ProjectSidebar project={project} profile={profile} />
            
            {/* Atualizador de status */}
            {isContractedStatus && (
              <ProjectStatusUpdater
                projectId={project.id}
                currentStatus={project.status}
                userType={profile?.user_type as 'client' | 'professional'}
                isOwner={isOwner || profile?.user_type === 'professional'}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
