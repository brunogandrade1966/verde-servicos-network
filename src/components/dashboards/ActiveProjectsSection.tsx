
import ActiveProjects from './ActiveProjects';
import ActivePartnerships from './ActivePartnerships';
import type { ActiveProject, ActivePartnership } from '@/types/dashboard';

interface ActiveProjectsSectionProps {
  activeProjects: ActiveProject[];
  activePartnerships: ActivePartnership[];
  loading: boolean;
}

const ActiveProjectsSection = ({ 
  activeProjects, 
  activePartnerships, 
  loading 
}: ActiveProjectsSectionProps) => {
  if (activeProjects.length === 0 && activePartnerships.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Projetos e Parcerias em Andamento</h2>
      <div className="grid lg:grid-cols-2 gap-8">
        {activeProjects.length > 0 && (
          <ActiveProjects 
            projects={activeProjects} 
            loading={loading} 
          />
        )}
        
        {activePartnerships.length > 0 && (
          <ActivePartnerships 
            partnerships={activePartnerships} 
            loading={loading} 
          />
        )}
      </div>
    </div>
  );
};

export default ActiveProjectsSection;
