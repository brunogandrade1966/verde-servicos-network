
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useApplications = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const applyToProject = async (projectId: string, professionalId: string, applicationData: {
    proposal: string;
    proposed_price?: number;
    estimated_duration?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          project_id: projectId,
          professional_id: professionalId,
          ...applicationData
        })
        .select()
        .single();

      if (error) {
        // Verificar se é erro de candidatura duplicada
        if (error.code === '23505' && error.message.includes('unique_application_per_project_professional')) {
          toast({
            title: "Candidatura já enviada",
            description: "Você já se candidatou para esta demanda anteriormente.",
            variant: "destructive"
          });
        } else {
          console.error('Error applying to project:', error);
          toast({
            title: "Erro ao enviar candidatura",
            description: error.message,
            variant: "destructive"
          });
        }
        return null;
      }

      toast({
        title: "Candidatura enviada!",
        description: "Sua candidatura foi enviada com sucesso. Aguarde o retorno do cliente."
      });

      return data;
    } catch (error) {
      console.error('Error applying to project:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao enviar a candidatura. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyToPartnership = async (partnershipDemandId: string, professionalId: string, applicationData: {
    proposal: string;
    proposed_price?: number;
    estimated_duration?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('partnership_applications')
        .insert({
          partnership_demand_id: partnershipDemandId,
          professional_id: professionalId,
          ...applicationData
        })
        .select()
        .single();

      if (error) {
        // Verificar se é erro de candidatura duplicada
        if (error.code === '23505' && error.message.includes('unique_partnership_application_per_demand_professional')) {
          toast({
            title: "Candidatura já enviada",
            description: "Você já se candidatou para esta demanda de parceria anteriormente.",
            variant: "destructive"
          });
        } else {
          console.error('Error applying to partnership:', error);
          toast({
            title: "Erro ao enviar candidatura",
            description: error.message,
            variant: "destructive"
          });
        }
        return null;
      }

      toast({
        title: "Candidatura enviada!",
        description: "Sua candidatura para parceria foi enviada com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Error applying to partnership:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao enviar a candidatura. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const acceptApplication = async (applicationId: string, type: 'project' | 'partnership' = 'project') => {
    setLoading(true);
    try {
      const table = type === 'project' ? 'applications' : 'partnership_applications';
      
      const { error } = await supabase
        .from(table)
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (error) {
        console.error('Error accepting application:', error);
        toast({
          title: "Erro ao aceitar candidatura",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      const demandType = type === 'project' ? 'projeto' : 'demanda de parceria';
      toast({
        title: "Candidatura aceita!",
        description: `A candidatura foi aceita com sucesso. O ${demandType} foi automaticamente movido para "Em Andamento".`
      });

      return true;
    } catch (error) {
      console.error('Error accepting application:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao aceitar a candidatura. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    applyToProject,
    applyToPartnership,
    acceptApplication
  };
};
