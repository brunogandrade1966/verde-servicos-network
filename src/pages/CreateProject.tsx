
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProjectForm } from '@/components/project/ProjectForm';
import { useServices } from '@/hooks/useServices';
import ClientLayout from '@/components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CreateProject = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { services, loading } = useServices();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </ClientLayout>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <ClientLayout>
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Demanda</CardTitle>
          <CardDescription>
            Publique uma nova demanda de serviço ambiental
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm
            services={services}
            profileId={profile.id}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </ClientLayout>
  );
};

export default CreateProject;
