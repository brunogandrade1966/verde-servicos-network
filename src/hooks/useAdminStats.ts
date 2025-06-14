
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Stats {
  totalUsers: number;
  totalClients: number;
  totalProfessionals: number;
  totalProjects: number;
  totalApplications: number;
  totalPartnerships: number;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalClients: 0,
    totalProfessionals: 0,
    totalProjects: 0,
    totalApplications: 0,
    totalPartnerships: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch user stats
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('user_type');

      if (usersError) {
        toast({
          title: "Erro ao carregar estatísticas de usuários",
          description: usersError.message,
          variant: "destructive"
        });
      }

      // Fetch projects count
      const { count: projectsCount, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (projectsError) {
        toast({
          title: "Erro ao carregar estatísticas de projetos",
          description: projectsError.message,
          variant: "destructive"
        });
      }

      // Fetch applications count
      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      if (applicationsError) {
        toast({
          title: "Erro ao carregar estatísticas de candidaturas",
          description: applicationsError.message,
          variant: "destructive"
        });
      }

      // Fetch partnerships count
      const { count: partnershipsCount, error: partnershipsError } = await supabase
        .from('partnerships')
        .select('*', { count: 'exact', head: true });

      if (partnershipsError) {
        toast({
          title: "Erro ao carregar estatísticas de parcerias",
          description: partnershipsError.message,
          variant: "destructive"
        });
      }

      if (usersData) {
        const totalUsers = usersData.length;
        const totalClients = usersData.filter(u => u.user_type === 'client').length;
        const totalProfessionals = usersData.filter(u => u.user_type === 'professional').length;

        setStats({
          totalUsers,
          totalClients,
          totalProfessionals,
          totalProjects: projectsCount || 0,
          totalApplications: applicationsCount || 0,
          totalPartnerships: partnershipsCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
};
