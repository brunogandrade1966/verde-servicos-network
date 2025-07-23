import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminDatabase = () => {
  const { profile } = useAuth();

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Banco de Dados</h1>
          <p className="text-gray-600">Monitore e gerencie o banco de dados</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDatabase;