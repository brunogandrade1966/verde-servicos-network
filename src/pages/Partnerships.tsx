
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ClientLayout from '@/components/layout/ClientLayout';
import PartnershipHeader from '@/components/partnerships/PartnershipHeader';
import PartnershipFilters from '@/components/partnerships/PartnershipFilters';
import PartnershipStats from '@/components/partnerships/PartnershipStats';
import PartnershipList from '@/components/partnerships/PartnershipList';

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
  status: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
    avatar_url?: string;
  };
}

const Partnerships = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [demands, setDemands] = useState<PartnershipDemand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [collaborationType, setCollaborationType] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchPartnershipDemands();
  }, []);

  const fetchPartnershipDemands = async () => {
    try {
      let query = supabase
        .from('partnership_demands')
        .select(`
          *,
          services(name, category),
          profiles(name, avatar_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      // Only show demands from professionals who have the required service in their professional_services
      // and exclude demands created by the current user
      if (profile?.id) {
        query = query.neq('professional_id', profile.id);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Erro ao carregar demandas de parceria",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Additional filtering to ensure the demand creator actually offers the service
        const validDemands = [];
        
        for (const demand of data || []) {
          // Check if the professional who created this demand actually offers this service
          const { data: professionalServices } = await supabase
            .from('professional_services')
            .select('service_id')
            .eq('professional_id', demand.professional_id)
            .eq('service_id', demand.service_id);
          
          // Only include demands where the professional actually offers the service
          if (professionalServices && professionalServices.length > 0) {
            validDemands.push(demand);
          }
        }
        
        setDemands(validDemands);
      }
    } catch (error) {
      console.error('Error fetching partnership demands:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDemands = demands.filter(demand => {
    const matchesSearch = demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demand.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = collaborationType === 'all' || demand.collaboration_type === collaborationType;
    const matchesCategory = categoryFilter === 'all' || demand.services.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = [...new Set(demands.map(d => d.services.category))];

  return (
    <ClientLayout>
      <div className="space-y-6">
        <PartnershipHeader userType={profile?.user_type} />

        <PartnershipFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          collaborationType={collaborationType}
          setCollaborationType={setCollaborationType}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
        />

        <PartnershipStats
          totalDemands={demands.length}
          filteredCount={filteredDemands.length}
          categoriesCount={categories.length}
        />

        <PartnershipList
          demands={demands}
          filteredDemands={filteredDemands}
          loading={loading}
          userType={profile?.user_type}
        />
      </div>
    </ClientLayout>
  );
};

export default Partnerships;
