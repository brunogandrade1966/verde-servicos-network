
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectFormFields } from './ProjectFormFields';
import { ProjectFormActions } from './ProjectFormActions';
import { useServices } from '@/hooks/useServices';

interface FormData {
  title: string;
  description: string;
  service_id: string;
  budget_min: string;
  budget_max: string;
  deadline: string;
  location: string;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
}

interface EditProjectFormProps {
  formData: FormData;
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (isDraft: boolean) => void;
}

export const EditProjectForm = ({ formData, loading, onInputChange, onSubmit }: EditProjectFormProps) => {
  const { services = [] } = useServices();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Demanda</CardTitle>
        <CardDescription>
          Atualize os detalhes da sua demanda ambiental
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProjectFormFields
          formData={formData}
          services={services}
          onInputChange={onInputChange}
        />
        <ProjectFormActions
          loading={loading}
          onSaveDraft={() => onSubmit(true)}
          onPublish={() => onSubmit(false)}
        />
      </CardContent>
    </Card>
  );
};
