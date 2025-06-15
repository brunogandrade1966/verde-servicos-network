
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DashboardStats from './DashboardStats';
import RecentProjects from './RecentProjects';
import MyApplications from './MyApplications';
import ActiveProjects from './ActiveProjects';
import ActivePartnerships from './ActivePartnerships';
import ClientLayout from '@/components/layout/ClientLayout';

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
  services: {
    name: string;
  };
  profiles: {
    name: string;
  };
}

interface ProjectApplication {
  id: string;
  status: string;
  proposed_price?: number;
  created_at: string;
  projects: {
    title: string;
    status: string;
  };
}

interface PartnershipApplication {
  id: string;
  status: string;
  proposed_price?: number;
  created_at: string;
  partnership_demands: {
    title: string;
    status: string;
  };
}

interface ApplicationData {
  id: string;
  status: string;
  proposed_price?: number;
  created_at: string;
  type: 'project' | 'partnership';
  projects?: {
    title: string;
    status: string;
  };
  partnership_demands?: {
    title: string;
    status: string;
  };
}

interface ActiveProject {
  id: string;
  title: string;
  status: string;
  deadline?: string;
  client: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

interface ActivePartnership {
  id: string;
  title: string;
  status: string;
  deadline?: string;
  creator: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

const ProfessionalDashboard = () => {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [activePartnerships, setActivePartnerships] = useState<ActivePartnership[]>([]);
  const [partnershipsCount, setPartnershipsCount] = useState(0);
  const [partnershipApplicationsCount, setPartnershipApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch open projects (client demands)
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          services(name),
          profiles(name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10);

      if (projectsError) {
        toast({
          title: "Erro ao carregar demandas",
          description: projectsError.message,
          variant: "destructive"
        });
      } else {
        setProjects(projectsData || []);
      }

      // Fetch active projects where professional was accepted
      const { data: acceptedApplications } = await supabase
        .from('applications')
        .select('project_id')
        .eq('professional_id', profile?.id)
        .eq('status', 'accepted');

      if (acceptedApplications && acceptedApplications.length > 0) {
        const projectIds = acceptedApplications.map(app => app.project_id);
        const { data: activeProjectsData } = await supabase
          .from('projects')
          .select(`
            id,
            title,
            status,
            deadline,
            client:profiles!projects_client_id_fkey(id, name, avatar_url)
          `)
          .in('id', projectIds)
          .in('status', ['in_progress', 'completed']);

        setActiveProjects(activeProjectsData || []);
      }

      // Fetch active partnerships where professional was accepted
      const { data: acceptedPartnershipApplications } = await supabase
        .from('partnership_applications')
        .select('partnership_demand_id')
        .eq('professional_id', profile?.id)
        .eq('status', 'accepted');

      if (acceptedPartnershipApplications && acceptedPartnershipApplications.length > 0) {
        const partnershipIds = acceptedPartnershipApplications.map(app => app.partnership_demand_id);
        const { data: activePartnershipsData } = await supabase
          .from('partnership_demands')
          .select(`
            id,
            title,
            status,
            deadline,
            creator:profiles!partnership_demands_professional_id_fkey(id, name, avatar_url)
          `)
          .in('id', partnershipIds)
          .in('status', ['in_progress', 'completed']);

        setActivePartnerships(activePartnershipsData || []);
      }

      // Fetch partnership demands count
      const { count: partnershipsCount, error: partnershipsError } = await supabase
        .from('partnership_demands')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      if (!partnershipsError) {
        setPartnershipsCount(partnershipsCount || 0);
      }

      // Fetch user project applications
      const { data: projectApplicationsData, error: projectApplicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          projects(title, status)
        `)
        .eq('professional_id', profile?.id)
        .order('created_at', { ascending: false });

      // Fetch user partnership applications
      const { data: partnershipApplicationsData, error: partnershipApplicationsError } = await supabase
        .from('partnership_applications')
        .select(`
          *,
          partnership_demands(title, status)
        `)
        .eq('professional_id', profile?.id)
        .order('created_at', { ascending: false });

      // Combine applications with type information
      const allApplications: ApplicationData[] = [];

      if (projectApplicationsData) {
        const projectApps = projectApplicationsData.map((app: ProjectApplication) => ({
          ...app,
          type: 'project' as const
        }));
        allApplications.push(...projectApps);
      }

      if (partnershipApplicationsData) {
        const partnershipApps = partnershipApplicationsData.map((app: PartnershipApplication) => ({
          ...app,
          type: 'partnership' as const
        }));
        allApplications.push(...partnershipApps);
      }

      // Sort all applications by creation date
      allApplications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      if (projectApplicationsError) {
        toast({
          title: "Erro ao carregar candidaturas de projetos",
          description: projectApplicationsError.message,
          variant: "destructive"
        });
      }

      if (partnershipApplicationsError) {
        toast({
          title: "Erro ao carregar candidaturas de parcerias",
          description: partnershipApplicationsError.message,
          variant: "destructive"
        });
      }

      setApplications(allApplications);

      // Fetch partnership applications count
      const { count: partnershipAppsCount, error: partnershipAppsError } = await supabase
        .from('partnership_applications')
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', profile?.id);

      if (!partnershipAppsError) {
        setPartnershipApplicationsCount(partnershipAppsCount || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-8">
        <DashboardStats 
          applications={applications} 
          projectsCount={projects.length}
          partnershipsCount={partnershipsCount}
          partnershipApplicationsCount={partnershipApplicationsCount}
        />

        {/* Active Projects and Partnerships Section */}
        {(activeProjects.length > 0 || activePartnerships.length > 0) && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Projetos e Parcerias em Andamento</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {activeProjects.length > 0 && (
                <ActiveProjects 
                  projects={activeProjects} 
                  loading={loading} 
                />
              )}
              
              {activePartnerships.length > 0 && (
                <ActivePartnerships 
                  partnerships={activePartnerships} 
                  loading={loading} 
                />
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <RecentProjects 
            projects={projects} 
            loading={loading} 
          />
          
          <MyApplications 
            applications={applications} 
            loading={loading} 
          />
        </div>
      </div>
    </ClientLayout>
  );
};

export default ProfessionalDashboard;
