
import { useEditProject } from '@/hooks/useEditProject';
import { EditProjectHeader } from '@/components/project/EditProjectHeader';
import { EditProjectForm } from '@/components/project/EditProjectForm';
import { EditProjectLoading } from '@/components/project/EditProjectLoading';
import { EditProjectNotFound } from '@/components/project/EditProjectNotFound';

const EditProject = () => {
  const {
    project,
    formData,
    loading,
    loadingProject,
    handleInputChange,
    handleSubmit
  } = useEditProject();

  if (loadingProject) {
    return <EditProjectLoading />;
  }

  if (!project) {
    return <EditProjectNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <EditProjectHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EditProjectForm
          formData={formData}
          loading={loading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
};

export default EditProject;
