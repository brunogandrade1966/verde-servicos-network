
import ContractedProjectCard from './ContractedProjectCard';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

interface ContractedProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
  };
}

interface ContractedProjectsGridProps {
  projects: ContractedProject[];
  userType?: string;
}

const ContractedProjectsGrid = ({ projects, userType }: ContractedProjectsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ContractedProjectCard 
          key={project.id} 
          project={project} 
          userType={userType}
        />
      ))}
    </div>
  );
};

export default ContractedProjectsGrid;
