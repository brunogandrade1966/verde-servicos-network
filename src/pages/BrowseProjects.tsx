
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useServices } from '@/hooks/useServices';
import BrowseProjectsHeader from '@/components/projects/BrowseProjectsHeader';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

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
    category: string;
  };
  profiles: {
    name: string;
  };
}

const BrowseProjects = () => {
  const { toast } = useToast();
  const { services } = useServices();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          services(name, category),
          profiles(name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar projetos",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = !selectedService || project.services?.name === selectedService;
    const matchesCategory = !selectedCategory || project.services?.category === selectedCategory;

    return matchesSearch && matchesService && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <BrowseProjectsHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectFilters
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
            Projetos Disponíveis
          </h2>
          <p className="text-gray-600">
            {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        <ProjectsGrid projects={filteredProjects} loading={loading} />
      </main>
    </div>
  );
};

export default BrowseProjects;
