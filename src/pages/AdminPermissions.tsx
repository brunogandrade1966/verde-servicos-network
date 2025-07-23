import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminPermissions = () => {
  const { profile } = useAuth();

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Permissões</h1>
          <p className="text-gray-600">Configure permissões e níveis de acesso</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPermissions;