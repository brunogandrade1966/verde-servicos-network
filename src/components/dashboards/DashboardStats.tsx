
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ApplicationData } from '@/types/dashboard';

interface DashboardStatsProps {
  applications: ApplicationData[];
  projectsCount: number;
  partnershipsCount?: number;
  partnershipApplicationsCount?: number;
}

const DashboardStats = ({ 
  applications, 
  projectsCount, 
  partnershipsCount = 0,
  partnershipApplicationsCount = 0
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-green-600">
            {applications.length}
          </CardTitle>
          <CardDescription>Candidaturas Enviadas</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-blue-600">
            {applications.filter(a => a.status === 'pending').length}
          </CardTitle>
          <CardDescription>Aguardando Resposta</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-orange-600">
            {partnershipApplicationsCount}
          </CardTitle>
          <CardDescription>Candidaturas Parcerias</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-purple-600">
            {projectsCount + partnershipsCount}
          </CardTitle>
          <CardDescription>Demandas Disponíveis</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default DashboardStats;
