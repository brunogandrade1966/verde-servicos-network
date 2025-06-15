
import { useProfessionalDashboard } from '@/hooks/useProfessionalDashboard';
import MyApplications from '@/components/dashboards/MyApplications';
import ClientLayout from '@/components/layout/ClientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const MyApplicationsPage = () => {
  const { profile, loading: authLoading } = useAuth();
  const { data, loading } = useProfessionalDashboard();

  console.log('MyApplicationsPage - profile:', profile, 'authLoading:', authLoading);
  console.log('MyApplicationsPage - applications:', data.applications, 'loading:', loading);

  if (authLoading || loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      </ClientLayout>
    );
  }

  if (profile?.user_type !== 'professional') {
    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600">Apenas profissionais podem ver suas candidaturas.</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MyApplications 
          applications={data.applications} 
          loading={loading} 
        />
      </div>
    </ClientLayout>
  );
};

export default MyApplicationsPage;
