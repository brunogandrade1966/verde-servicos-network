
import { useAuth } from '@/contexts/AuthContext';
import NewClientDashboard from '@/components/dashboards/NewClientDashboard';
import ProfessionalDashboard from '@/components/dashboards/ProfessionalDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import ClientLayout from '@/components/layout/ClientLayout';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { profile, loading, user } = useAuth();

  console.log('Dashboard - loading:', loading, 'user:', user, 'profile:', profile);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  // If we have a user but no profile yet, show loading
  if (user && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar perfil do usuário.</p>
        </div>
      </div>
    );
  }

  switch (profile.user_type) {
    case 'client':
      return (
        <ClientLayout>
          <NewClientDashboard />
        </ClientLayout>
      );
    case 'professional':
      return <ProfessionalDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <ClientLayout>
          <NewClientDashboard />
        </ClientLayout>
      );
  }
};

export default Dashboard;
