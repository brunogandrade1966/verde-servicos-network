
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  client_id: string;
  professional_id: string;
  created_at: string;
  updated_at: string;
  partnership_demand_id?: string;
  client_profile: {
    name: string;
    avatar_url?: string;
  };
  professional_profile: {
    name: string;
    avatar_url?: string;
  };
}

export const useConversations = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          client_profile:profiles!conversations_client_id_fkey(name, avatar_url),
          professional_profile:profiles!conversations_professional_id_fkey(name, avatar_url)
        `)
        .or(`client_id.eq.${userId},professional_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Erro ao carregar conversas",
        description: "Não foi possível carregar suas conversas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (clientId: string, professionalId: string, partnershipDemandId?: string) => {
    try {
      // Verificar se já existe uma conversa entre essas pessoas
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('client_id', clientId)
        .eq('professional_id', professionalId)
        .maybeSingle();

      if (existing) {
        return existing;
      }

      // Criar nova conversa
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          client_id: clientId,
          professional_id: professionalId,
          partnership_demand_id: partnershipDemandId
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Conversa criada!",
        description: "Você pode agora trocar mensagens."
      });

      // Atualizar lista de conversas
      await fetchConversations();
      
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erro ao criar conversa",
        description: "Não foi possível iniciar a conversa.",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  return {
    conversations,
    loading,
    createConversation,
    refreshConversations: fetchConversations
  };
};
