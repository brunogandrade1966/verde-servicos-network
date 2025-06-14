
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  client_id: string;
  professional_id: string;
  updated_at: string;
  client_profile?: {
    name: string;
    avatar_url?: string;
  };
  professional_profile?: {
    name: string;
    avatar_url?: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count?: number;
}

export const useMessaging = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  const fetchConversations = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      // Buscar conversas onde o usuário participa
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          id,
          client_id,
          professional_id,
          updated_at,
          client_profile:profiles!conversations_client_id_fkey(name, avatar_url),
          professional_profile:profiles!conversations_professional_id_fkey(name, avatar_url)
        `)
        .or(`client_id.eq.${userId},professional_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Para cada conversa, buscar a última mensagem e contar não lidas
      const conversationsWithDetails = await Promise.all(
        (conversationsData || []).map(async (conversation) => {
          // Última mensagem
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Contagem de mensagens não lidas (enviadas por outros para o usuário atual)
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .neq('sender_id', userId)
            .is('read_at', null);

          return {
            ...conversation,
            last_message: lastMessage,
            unread_count: unreadCount || 0
          };
        })
      );

      setConversations(conversationsWithDetails);
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

  const createConversation = async (clientId: string, professionalId: string) => {
    try {
      // Verificar se já existe uma conversa
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('client_id', clientId)
        .eq('professional_id', professionalId)
        .single();

      if (existing) {
        return existing;
      }

      // Criar nova conversa
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          client_id: clientId,
          professional_id: professionalId
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Conversa criada!",
        description: "Você pode agora trocar mensagens."
      });

      // Recarregar conversas
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

  const getTotalUnreadCount = () => {
    return conversations.reduce((total, conv) => total + (conv.unread_count || 0), 0);
  };

  return {
    conversations,
    loading,
    createConversation,
    refreshConversations: fetchConversations,
    totalUnreadCount: getTotalUnreadCount()
  };
};
