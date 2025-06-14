
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Application {
  id: string;
  status: string;
  proposed_price?: number;
  created_at: string;
  projects: {
    title: string;
    status: string;
  };
}

interface DashboardStatsProps {
  applications: Application[];
  projectsCount: number;
}

const DashboardStats = ({ applications, projectsCount }: DashboardStatsProps) => {
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
            {applications.filter(a => a.status === 'accepted').length}
          </CardTitle>
          <CardDescription>Candidaturas Aceitas</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-purple-600">
            {projectsCount}
          </CardTitle>
          <CardDescription>Novos Projetos</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default DashboardStats;
