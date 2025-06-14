
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Briefcase, Star, Leaf } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalClients: number;
  totalProfessionals: number;
  totalProjects: number;
  totalApplications: number;
  totalPartnerships: number;
}

interface AdminStatsProps {
  stats: Stats;
  loading: boolean;
}

const AdminStats = ({ stats, loading }: AdminStatsProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription>Total de Usuários</CardDescription>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-blue-600">
            {stats.totalUsers}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            {stats.totalClients} clientes • {stats.totalProfessionals} profissionais
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription>Projetos na Plataforma</CardDescription>
            <FileText className="h-4 w-4 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">
            {stats.totalProjects}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Projetos cadastrados por clientes
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription>Candidaturas Enviadas</CardDescription>
            <Briefcase className="h-4 w-4 text-orange-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-orange-600">
            {stats.totalApplications}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Candidaturas de profissionais
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription>Parcerias Formadas</CardDescription>
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-purple-600">
            {stats.totalPartnerships}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Colaborações entre profissionais
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription>Taxa de Engajamento</CardDescription>
            <Star className="h-4 w-4 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-yellow-600">
            {stats.totalProjects > 0 ? Math.round((stats.totalApplications / stats.totalProjects) * 100) / 100 : 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Candidaturas por projeto
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription>Crescimento</CardDescription>
            <Leaf className="h-4 w-4 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">
            +{stats.totalUsers}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Novos usuários cadastrados
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
