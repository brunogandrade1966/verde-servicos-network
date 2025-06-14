
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

const ProfessionalDashboard = () => {
  const { profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch open projects
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
          title: "Erro ao carregar projetos",
          description: projectsError.message,
          variant: "destructive"
        });
      } else {
        setProjects(projectsData || []);
      }

      // Fetch user applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          projects(title, status)
        `)
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
        />

        <DashboardNavigation />

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
