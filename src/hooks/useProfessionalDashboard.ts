
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { 
  Project, 
  ProjectApplication, 
  PartnershipApplication, 
  ApplicationData, 
  ActiveProject, 
  ActivePartnership,
  DashboardData 
} from '@/types/dashboard';

export const useProfessionalDashboard = () => {
  const { profile } = useAuth();
  const [data, setData] = useState<DashboardData>({
    projects: [],
    applications: [],
    activeProjects: [],
    activePartnerships: [],
    partnershipsCount: 0,
    partnershipApplicationsCount: 0,
  });
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
      }

      // Fetch active projects where professional was accepted
      const { data: acceptedApplications } = await supabase
        .from('applications')
        .select('project_id')
        .eq('professional_id', profile?.id)
        .eq('status', 'accepted');

      let activeProjectsData: ActiveProject[] = [];
      if (acceptedApplications && acceptedApplications.length > 0) {
        const projectIds = acceptedApplications.map(app => app.project_id);
        const { data } = await supabase
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

        activeProjectsData = data || [];
      }

      // Fetch active partnerships where professional was accepted
      const { data: acceptedPartnershipApplications } = await supabase
        .from('partnership_applications')
        .select('partnership_demand_id')
        .eq('professional_id', profile?.id)
        .eq('status', 'accepted');

      let activePartnershipsData: ActivePartnership[] = [];
      if (acceptedPartnershipApplications && acceptedPartnershipApplications.length > 0) {
        const partnershipIds = acceptedPartnershipApplications.map(app => app.partnership_demand_id);
        const { data } = await supabase
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

        activePartnershipsData = data || [];
      }

      // Fetch partnership demands count
      const { count: partnershipsCount } = await supabase
        .from('partnership_demands')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

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

      // Combine applications with type information and preserve IDs
      const allApplications: ApplicationData[] = [];

      if (projectApplicationsData) {
        const projectApps = projectApplicationsData.map((app: ProjectApplication) => ({
          ...app,
          type: 'project' as const,
          project_id: app.project_id
        }));
        allApplications.push(...projectApps);
      }

      if (partnershipApplicationsData) {
        const partnershipApps = partnershipApplicationsData.map((app: PartnershipApplication) => ({
          ...app,
          type: 'partnership' as const,
          partnership_demand_id: app.partnership_demand_id
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

      // Fetch partnership applications count
      const { count: partnershipAppsCount } = await supabase
        .from('partnership_applications')
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', profile?.id);

      setData({
        projects: projectsData || [],
        applications: allApplications,
        activeProjects: activeProjectsData,
        activePartnerships: activePartnershipsData,
        partnershipsCount: partnershipsCount || 0,
        partnershipApplicationsCount: partnershipAppsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, refetch: fetchData };
};
