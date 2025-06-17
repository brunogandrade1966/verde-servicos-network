
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProjectInfo from './ProjectInfo';
import ProjectSidebar from './ProjectSidebar';
import ProjectTimeline from './ProjectTimeline';
import ProjectStatusUpdater from './ProjectStatusUpdater';
import ServiceCompletionConfirmation from '@/components/reviews/ServiceCompletionConfirmation';
import MutualReviewSystem from '@/components/reviews/MutualReviewSystem';
import ProjectApplications from './ProjectApplications';
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

interface ProjectDetailsContentProps {
  projectId: string;
}

const ProjectDetailsContent = ({ projectId }: ProjectDetailsContentProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails(projectId);
      checkIfApplied(projectId);
      fetchApplications(projectId);
    }
  }, [projectId, profile]);

  const fetchProjectDetails = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          services(name, category),
          profiles(name)
        `)
        .eq('id', id)
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

  const fetchApplications = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles(id, name, bio, avatar_url)
        `)
        .eq('project_id', id)
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

  const checkIfApplied = async (id: string) => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('project_id', id)
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
    if (projectId) {
      fetchApplications(projectId);
      fetchProjectDetails(projectId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Projeto não encontrado
        </h3>
        <p className="text-gray-500">
          O projeto que você está procurando não existe ou foi removido.
        </p>
      </div>
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
              userType={profile?.user_type === 'admin' ? 'client' : (profile?.user_type || 'client')}
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
            <ProjectApplications 
              applications={applications}
              profile={profile}
              onApplicationUpdate={handleApplicationUpdate}
            />
          )}
          
          <ProjectTimeline events={timelineEvents} currentStatus={project.status} />
        </div>

        <div className="lg:col-span-1">
          <ProjectSidebar 
            project={project}
            profile={profile}
            canApply={canApply}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsContent;
