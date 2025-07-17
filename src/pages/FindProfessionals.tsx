
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProfessionalsFilters from '@/components/professionals/ProfessionalsFilters';
import ProfessionalsGrid from '@/components/professionals/ProfessionalsGrid';
import ClientLayout from '@/components/layout/ClientLayout';
import { SubscriptionGuard } from '@/components/subscription/SubscriptionGuard';

interface Professional {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  professional_services: Array<{
    id: string;
    price_range?: string;
    experience_years?: number;
    services: {
      id: string;
      name: string;
      category: string;
    };
  }>;
}

interface Service {
  id: string;
  name: string;
  category: string;
}

const FindProfessionals = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    fetchProfessionals();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          bio,
          avatar_url,
          city,
          state,
          professional_services(
            id,
            price_range,
            experience_years,
            services(id, name, category)
          )
        `)
        .eq('user_type', 'professional')
        .neq('id', profile?.id || ''); // Exclude the authenticated professional

      if (error) {
        toast({
          title: "Erro ao carregar profissionais",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Only include professionals who have at least one service selected
      const professionalsWithServices = (data || []).filter(
        professional => professional.professional_services && professional.professional_services.length > 0
      );

      setProfessionals(professionalsWithServices);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = professionals.filter(professional => {
    // Filter by search query
    const matchesSearch = professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         professional.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by specific service (by service ID)
    const matchesService = !selectedService || 
                          professional.professional_services.some(ps => ps.services.id === selectedService);
    
    // Filter by category
    const matchesCategory = !selectedCategory ||
                           professional.professional_services.some(ps => ps.services.category === selectedCategory);

    // Filter by city
    const matchesCity = !selectedCity || professional.city === selectedCity;
    
    // Filter by state
    const matchesState = !selectedState || professional.state === selectedState;

    return matchesSearch && matchesService && matchesCategory && matchesCity && matchesState;
  });

  // Extract unique cities and states from professionals
  const cities = [...new Set(professionals.map(p => p.city).filter(Boolean))].sort();
  const states = [...new Set(professionals.map(p => p.state).filter(Boolean))].sort();

  return (
    <ClientLayout>
      <ProfessionalsFilters
        searchQuery={searchQuery}
        selectedService={selectedService}
        selectedCategory={selectedCategory}
        selectedCity={selectedCity}
        selectedState={selectedState}
        services={services}
        cities={cities}
        states={states}
        onSearchChange={setSearchQuery}
        onServiceChange={setSelectedService}
        onCategoryChange={setSelectedCategory}
        onCityChange={setSelectedCity}
        onStateChange={setSelectedState}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profissionais Disponíveis
        </h2>
        <p className="text-gray-600">
          {filteredProfessionals.length} profissional{filteredProfessionals.length !== 1 ? 'is' : ''} encontrado{filteredProfessionals.length !== 1 ? 's' : ''}
        </p>
      </div>

      <SubscriptionGuard>
        <ProfessionalsGrid professionals={filteredProfessionals} loading={loading} />
      </SubscriptionGuard>
    </ClientLayout>
  );
};

export default FindProfessionals;
