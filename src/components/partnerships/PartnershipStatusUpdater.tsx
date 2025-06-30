
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

interface PartnershipStatusUpdaterProps {
  demandId: string;
  currentStatus: ProjectStatus;
  userType: 'client' | 'professional';
  isCreator: boolean;
  isPartner: boolean;
  onStatusUpdate: () => void;
}

const PartnershipStatusUpdater = ({ 
  demandId, 
  currentStatus, 
  userType, 
  isCreator,
  isPartner,
  onStatusUpdate 
}: PartnershipStatusUpdaterProps) => {
  const [newStatus, setNewStatus] = useState<ProjectStatus>(currentStatus);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getAvailableStatuses = (): Partial<Record<ProjectStatus, string>> => {
    const baseStatuses = {
      draft: 'Rascunho',
      open: 'Aberto',
      in_progress: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };

    // Regras de transição baseadas no tipo de usuário e status atual
    if (isCreator && userType === 'professional') {
      switch (currentStatus) {
        case 'draft':
          return { 
            open: baseStatuses.open,
            cancelled: baseStatuses.cancelled 
          };
        case 'open':
          return { 
            in_progress: baseStatuses.in_progress,
            cancelled: baseStatuses.cancelled 
          };
        case 'in_progress':
          return { 
            cancelled: baseStatuses.cancelled 
          };
        default:
          return {};
      }
    } else if (isPartner && userType === 'professional') {
      // Profissional parceiro pode marcar como concluído quando em andamento
      switch (currentStatus) {
        case 'in_progress':
          return { 
            completed: baseStatuses.completed,
            cancelled: baseStatuses.cancelled 
          };
        default:
          return {};
      }
    }

    return {};
  };

  const availableStatuses = getAvailableStatuses();

  const handleStatusUpdate = async () => {
    if (newStatus === currentStatus) {
      toast({
        title: "Nenhuma alteração",
        description: "O status não foi alterado",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('partnership_demands')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', demandId);

      if (error) {
        toast({
          title: "Erro ao atualizar status",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Status atualizado!",
        description: `Status alterado para: ${availableStatuses[newStatus]}`
      });

      onStatusUpdate();
    } catch (error) {
      console.error('Error updating partnership status:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao atualizar o status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if ((!isCreator && !isPartner) || Object.keys(availableStatuses).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status da Parceria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status atual:</span>
            <ProjectStatusBadge status={currentStatus} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Atualizar Status da Parceria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status atual:</span>
          <ProjectStatusBadge status={currentStatus} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Novo Status:</label>
          <Select 
            value={newStatus} 
            onValueChange={(value) => setNewStatus(value as ProjectStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o novo status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableStatuses).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Observações (opcional):</label>
          <Textarea
            placeholder="Adicione informações sobre a atualização de status..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleStatusUpdate}
          disabled={loading || newStatus === currentStatus}
          className="w-full"
        >
          {loading ? 'Atualizando...' : 'Atualizar Status'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PartnershipStatusUpdater;
