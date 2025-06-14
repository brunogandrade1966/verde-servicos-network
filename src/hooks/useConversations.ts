
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  client_id: string;
  professional_id: string;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  professional?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
}

export const useConversations = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          client:profiles!conversations_client_id_fkey(id, name, avatar_url),
          professional:profiles!conversations_professional_id_fkey(id, name, avatar_url)
        `)
        .or(`client_id.eq.${userId},professional_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: "Erro ao carregar conversas",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (clientId: string, professionalId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{ client_id: clientId, professional_id: professionalId }])
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: "Erro ao criar conversa",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  return {
    conversations,
    loading,
    fetchConversations,
    createConversation
  };
};
