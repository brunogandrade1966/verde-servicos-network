
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProjectDetailsHeader from '@/components/projects/ProjectDetailsHeader';
import ProjectInfo from '@/components/projects/ProjectInfo';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectTimeline from '@/components/projects/ProjectTimeline';
import ProjectStatusUpdater from '@/components/projects/ProjectStatusUpdater';
import ServiceCompletionConfirmation from '@/components/reviews/ServiceCompletionConfirmation';
import MutualReviewSystem from '@/components/reviews/MutualReviewSystem';
import ClientLayout from '@/components/layout/ClientLayout';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

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
  status: ProjectStatus;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
  };
}

interface Application {
  id: string;
  proposed_price?: number;
  proposal: string;
  status: string;
  estimated_duration?: string;
  created_at: string;
  profiles: {
    id: string;
    name: string;
    bio?: string;
    avatar_url?: string;
  };
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
      checkIfApplied(id);
      fetchApplications(id);
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

  const fetchApplications = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles(id, name, bio, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
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

  const handleApplicationUpdate = () => {
    if (id) {
      fetchApplications(id);
      fetchProjectDetails(id);
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

  // Find accepted application to get professional info
  const acceptedApplication = applications.find(app => app.status === 'accepted');
  const assignedProfessional = acceptedApplication?.profiles;

  // Create timeline events from project data
  const timelineEvents = [
    {
      status: 'draft' as ProjectStatus,
      date: project.created_at,
      note: 'Projeto criado'
    }
  ];

  if (project.status !== 'draft') {
    timelineEvents.push({
      status: project.status,
      date: project.created_at,
      note: `Status atualizado para ${project.status}`
    });
  }

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <ProjectInfo project={project} />
            
            {/* Project Status Updater */}
            {(isOwner || (assignedProfessional && profile?.id === assignedProfessional.id)) && (
              <ProjectStatusUpdater
                projectId={project.id}
                currentStatus={project.status}
                userType={profile?.user_type || 'client'}
                isOwner={isOwner}
                onStatusUpdate={handleApplicationUpdate}
              />
            )}

            {/* Service Completion Confirmation */}
            {project.status === 'completed' && isOwner && assignedProfessional && (
              <ServiceCompletionConfirmation
                projectId={project.id}
                providerId={assignedProfessional.id}
                providerName={assignedProfessional.name}
                clientId={project.client_id}
                status={project.status}
                onConfirmation={handleApplicationUpdate}
              />
            )}

            {/* Mutual Review System */}
            {project.status === 'completed' && assignedProfessional && (
              <MutualReviewSystem
                projectId={project.id}
                professionalId={assignedProfessional.id}
                professionalName={assignedProfessional.name}
                clientId={project.client_id}
                status={project.status}
              />
            )}
            
            {isOwner && applications && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-medium mb-4">Candidaturas ({applications.length})</h3>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{application.profiles.name}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(application.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                            {application.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{application.proposal}</p>
                        {application.proposed_price && (
                          <p className="text-green-600 font-medium">
                            R$ {application.proposed_price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhuma candidatura recebida ainda.</p>
                )}
              </div>
            )}
            
            <ProjectTimeline events={timelineEvents} currentStatus={project.status} />
          </div>

          <div className="lg:col-span-1">
            <ProjectSidebar 
              project={project}
              profile={profile}
            />
            
            {canApply && (
              <div className="mt-6 bg-white rounded-lg border p-6">
                <h3 className="font-medium mb-4">Candidatar-se</h3>
                <button 
                  onClick={() => navigate(`/apply/${project.id}`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded"
                >
                  Enviar Candidatura
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ProjectDetails;
