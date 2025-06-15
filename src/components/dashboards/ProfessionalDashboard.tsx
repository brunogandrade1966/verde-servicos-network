
import { useProfessionalDashboard } from '@/hooks/useProfessionalDashboard';
import DashboardStats from './DashboardStats';
import RecentProjects from './RecentProjects';
import MyApplications from './MyApplications';
import ActiveProjectsSection from './ActiveProjectsSection';
import ClientLayout from '@/components/layout/ClientLayout';

const ProfessionalDashboard = () => {
  const { data, loading } = useProfessionalDashboard();

  return (
    <ClientLayout>
      <div className="space-y-8">
        <DashboardStats 
          applications={data.applications} 
          projectsCount={data.projects.length}
          partnershipsCount={data.partnershipsCount}
          partnershipApplicationsCount={data.partnershipApplicationsCount}
        />

        <ActiveProjectsSection
          activeProjects={data.activeProjects}
          activePartnerships={data.activePartnerships}
          loading={loading}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <RecentProjects 
            projects={data.projects} 
            loading={loading} 
          />
          
          <MyApplications 
            applications={data.applications} 
            loading={loading} 
          />
        </div>
      </div>
    </ClientLayout>
  );
};

export default ProfessionalDashboard;
