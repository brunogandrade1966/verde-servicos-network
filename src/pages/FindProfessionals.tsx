
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FindProfessionalsHeader from '@/components/professionals/FindProfessionalsHeader';
import ProfessionalsFilters from '@/components/professionals/ProfessionalsFilters';
import ProfessionalsGrid from '@/components/professionals/ProfessionalsGrid';

interface Professional {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  professional_services: Array<{
    id: string;
    price_range?: string;
    experience_years?: number;
    services: {
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
          professional_services(
            id,
            price_range,
            experience_years,
            services(name, category)
          )
        `)
        .eq('user_type', 'professional');

      if (error) {
        toast({
          title: "Erro ao carregar profissionais",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         professional.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = !selectedService || 
                          professional.professional_services.some(ps => ps.services.name === selectedService);
    
    const matchesCategory = !selectedCategory ||
                           professional.professional_services.some(ps => ps.services.category === selectedCategory);

    return matchesSearch && matchesService && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <FindProfessionalsHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfessionalsFilters
          searchQuery={searchQuery}
          selectedService={selectedService}
          selectedCategory={selectedCategory}
          services={services}
          onSearchChange={setSearchQuery}
          onServiceChange={setSelectedService}
          onCategoryChange={setSelectedCategory}
        />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profissionais Disponíveis
          </h2>
          <p className="text-gray-600">
            {filteredProfessionals.length} profissional{filteredProfessionals.length !== 1 ? 'is' : ''} encontrado{filteredProfessionals.length !== 1 ? 's' : ''}
          </p>
        </div>

        <ProfessionalsGrid professionals={filteredProfessionals} loading={loading} />
      </main>
    </div>
  );
};

export default FindProfessionals;
