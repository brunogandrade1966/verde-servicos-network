
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

interface ProjectFormActionsProps {
  loading: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const ProjectFormActions = ({ loading, onSaveDraft, onPublish }: ProjectFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-6">
      <Button
        variant="outline"
        onClick={onSaveDraft}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Salvar Rascunho
          </>
        )}
      </Button>
      <Button
        onClick={onPublish}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Publicando...
          </>
        ) : (
          'Publicar Demanda'
        )}
      </Button>
    </div>
  );
};
