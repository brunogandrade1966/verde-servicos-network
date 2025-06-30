
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ClientLayout from '@/components/layout/ClientLayout';
import PartnershipDetailsHeader from '@/components/partnerships/PartnershipDetailsHeader';
import PartnershipMainContent from '@/components/partnerships/PartnershipMainContent';
import PartnershipSidebar from '@/components/partnerships/PartnershipSidebar';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

interface PartnershipDemand {
  id: string;
  title: string;
  description: string;
  collaboration_type: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  required_skills?: string;
  created_at: string;
  status: ProjectStatus;
  professional_id: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
    avatar_url?: string;
    bio?: string;
    email: string;
    phone?: string;
    whatsapp?: string;
  };
}

interface Application {
  id: string;
  professional_id: string;
  proposal: string;
  proposed_price?: number;
  estimated_duration?: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
  professional?: {
    id: string;
    name: string;
    avatar_url?: string;
    area_of_expertise?: string;
  };
}

const PartnershipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [demand, setDemand] = useState<PartnershipDemand | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (id) {
      fetchPartnershipDemand();
    }
  }, [id]);

  const fetchPartnershipDemand = async () => {
    try {
      const { data, error } = await supabase
        .from('partnership_demands')
        .select(`
          *,
          services(name, category),
          profiles(name, avatar_url, bio, email, phone, whatsapp)
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Erro ao carregar demanda",
          description: error.message,
          variant: "destructive"
        });
        navigate('/partnerships');
      } else {
        setDemand(data);
        fetchApplications();
      }
    } catch (error) {
      console.error('Error fetching partnership demand:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('partnership_applications')
        .select(`
          *,
          professional:profiles!partnership_applications_professional_id_fkey(id, name, avatar_url, area_of_expertise)
        `)
        .eq('partnership_demand_id', id);

      if (error) {
        toast({
          title: "Erro ao carregar candidaturas",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setApplications(data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApply = () => {
    navigate(`/partnerships/${id}/apply`);
  };

  const handleEditDemand = () => {
    navigate(`/partnerships/${id}/edit`);
  };

  const updateApplicationStatus = async (applicationId: string, status: 'pending' | 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('partnership_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) {
        toast({
          title: "Erro ao atualizar status da candidatura",
          description: error.message,
          variant: "destructive"
        });
      } else {
        fetchApplications();
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-96">
          <p>Carregando demanda...</p>
        </div>
      </ClientLayout>
    );
  }

  if (!demand) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-96">
          <p>Demanda não encontrada</p>
        </div>
      </ClientLayout>
    );
  }

  const isOwnDemand = profile?.id === demand?.professional_id;
  const hasApplied = applications.some(app => app.professional_id === profile?.id);
  const canApply = !isOwnDemand && !hasApplied && demand?.status === 'open';

  const acceptedApplication = applications.find(app => app.status === 'accepted');
  const partnerProfessional = acceptedApplication?.professional;

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PartnershipDetailsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <PartnershipMainContent
            demand={demand}
            applications={applications}
            isOwnDemand={isOwnDemand}
            partnerProfessional={partnerProfessional}
            profileId={profile?.id}
            userType={profile?.user_type}
            onStatusUpdate={fetchPartnershipDemand}
            onUpdateApplicationStatus={updateApplicationStatus}
          />

          <PartnershipSidebar
            demand={demand}
            applications={applications}
            isOwnDemand={isOwnDemand}
            canApply={canApply}
            onApply={handleApply}
            onEdit={handleEditDemand}
            onUpdateApplicationStatus={updateApplicationStatus}
          />
        </div>
      </div>
    </ClientLayout>
  );
};

export default PartnershipDetails;
