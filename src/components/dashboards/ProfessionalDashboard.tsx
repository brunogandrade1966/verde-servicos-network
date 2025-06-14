
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import DashboardNavigation from './DashboardNavigation';
import RecentProjects from './RecentProjects';
import MyApplications from './MyApplications';
import ActiveProjects from './ActiveProjects';
import ActivePartnerships from './ActivePartnerships';

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

interface Application {
  id: string;
  status: string;
  proposed_price?: number;
  created_at: string;
  projects: {
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
  const { profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [activePartnerships, setActivePartnerships] = useState<ActivePartnership[]>([]);
  const [partnershipsCount, setPartnershipsCount] = useState(0);
  const [partnershipApplicationsCount, setPartnershipApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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

      // Fetch user applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          projects(title, status)
        `)
        .eq('professional_id', profile?.id)
        .order('created_at', { ascending: false });

      if (applicationsError) {
        toast({
          title: "Erro ao carregar candidaturas",
          description: applicationsError.message,
          variant: "destructive"
        });
      } else {
        setApplications(applicationsData || []);
      }

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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <DashboardHeader 
        profileName={profile?.name} 
        profileAvatar={profile?.avatar_url}
        onSignOut={handleSignOut} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats 
          applications={applications} 
          projectsCount={projects.length}
          partnershipsCount={partnershipsCount}
          partnershipApplicationsCount={partnershipApplicationsCount}
        />

        <DashboardNavigation />

        {/* Active Projects and Partnerships Section */}
        {(activeProjects.length > 0 || activePartnerships.length > 0) && (
          <div className="mb-8">
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
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
