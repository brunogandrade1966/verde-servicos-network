
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import ImportServices from '@/components/admin/ImportServices';

const ImportServicesPage = () => {
  const { profile } = useAuth();

  console.log('ImportServicesPage - profile:', profile);
  console.log('ImportServicesPage - user_type:', profile?.user_type);

  // Verificar se o usuário é admin
  if (profile?.user_type !== 'admin') {
    console.log('ImportServicesPage - Redirecting non-admin user to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ImportServicesPage - Rendering import services page for admin');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Importar Serviços</h1>
          <p className="text-gray-600">Carregue os serviços ambientais predefinidos no sistema</p>
        </div>
        
        <ImportServices />
      </div>
    </AdminLayout>
  );
};

export default ImportServicesPage;
