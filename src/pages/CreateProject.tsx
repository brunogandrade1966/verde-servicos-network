
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { ProjectForm } from '@/components/project/ProjectForm';
import { useServices } from '@/hooks/useServices';

const CreateProject = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { services, loading } = useServices();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <ProjectHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectForm
          services={services}
          profileId={profile.id}
          onSuccess={handleSuccess}
        />
      </main>
    </div>
  );
};

export default CreateProject;
