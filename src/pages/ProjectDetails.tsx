
import { useParams } from 'react-router-dom';
import ClientLayout from '@/components/layout/ClientLayout';
import ProjectDetailsContent from '@/components/projects/ProjectDetailsContent';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <ClientLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Projeto não encontrado
          </h3>
          <p className="text-gray-500">
            ID do projeto não fornecido.
          </p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <ProjectDetailsContent projectId={id} />
    </ClientLayout>
  );
};

export default ProjectDetails;
