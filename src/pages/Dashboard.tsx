
import { useAuth } from '@/contexts/AuthContext';
import ClientDashboard from '@/components/dashboards/ClientDashboard';
import ProfessionalDashboard from '@/components/dashboards/ProfessionalDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  switch (profile.user_type) {
    case 'client':
      return <ClientDashboard />;
    case 'professional':
      return <ProfessionalDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <ClientDashboard />;
  }
};

export default Dashboard;
