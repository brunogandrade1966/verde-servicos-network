
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import AdminQuickActions from '@/components/admin/AdminQuickActions';
import AdminSystemStatus from '@/components/admin/AdminSystemStatus';
import { useAdminStats } from '@/hooks/useAdminStats';

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const { stats, loading } = useAdminStats();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <AdminHeader profileName={profile?.name} onSignOut={handleSignOut} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visão Geral da Plataforma</h2>
          <AdminStats stats={stats} loading={loading} />
        </div>

        <AdminQuickActions />

        <AdminSystemStatus />
      </main>
    </div>
  );
};

export default AdminDashboard;
