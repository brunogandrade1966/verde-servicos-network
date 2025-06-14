
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrowseProjectsHeader from '@/components/projects/BrowseProjectsHeader';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

interface Project {
  id: string;
  title: string;
  description: string;
  location?: string;
  deadline?: string;
  budget_min?: number;
  budget_max?: number;
  created_at: string;
  service_id: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
  };
}

interface Service {
  id: string;
  name: string;
  category: string;
}

const BrowseProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          services(name, category),
          profiles(name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (projectsError) {
        toast({
          title: "Erro ao carregar projetos",
          description: projectsError.message,
          variant: "destructive"
        });
        return;
      }

      setProjects(projectsData || []);

      // Fetch services for filters
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });

      if (servicesError) {
        toast({
          title: "Erro ao carregar serviços",
          description: servicesError.message,
          variant: "destructive"
        });
        return;
      }

      setServices(servicesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar os dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = !searchTerm || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.services.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || 
        project.services.category === selectedCategory;

      const matchesService = selectedService === 'all' || 
        project.service_id === selectedService;

      return matchesSearch && matchesCategory && matchesService;
    });
  }, [projects, searchTerm, selectedCategory, selectedService]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <BrowseProjectsHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProjectFilters
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              selectedService={selectedService}
              services={services}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              onServiceChange={setSelectedService}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Projetos Disponíveis
              </h2>
              <p className="text-gray-600">
                {filteredProjects.length} projeto(s) encontrado(s)
              </p>
            </div>

            <ProjectsGrid projects={filteredProjects} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseProjects;
