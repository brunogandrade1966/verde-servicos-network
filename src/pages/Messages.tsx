
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import ConversationPreview from '@/components/messages/ConversationPreview';
import ConversationView from '@/components/messages/ConversationView';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import ClientLayout from '@/components/layout/ClientLayout';

const Messages = () => {
  const { profile } = useAuth();
  const { conversations, loading } = useConversations(profile?.id);
  const { unreadCount } = useUnreadMessages();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

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
    return (
      <ClientLayout>
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Acesso negado
            </h3>
            <p className="text-gray-500">
              Você precisa estar logado para acessar as mensagens.
            </p>
          </CardContent>
        </Card>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      {selectedConversationId ? (
        <ConversationView
          conversationId={selectedConversationId}
          currentUserId={profile.id}
          onBack={() => setSelectedConversationId(null)}
        />
      ) : (
        <div className="space-y-4">
          {conversations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma conversa encontrada
                </h3>
                <p className="text-gray-500 mb-4">
                  Você ainda não possui conversas ativas.
                </p>
                <p className="text-sm text-gray-400">
                  {profile.user_type === 'client' 
                    ? 'Entre em contato com profissionais através dos perfis deles.'
                    : 'Aguarde clientes entrarem em contato ou candidate-se a projetos.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Suas Conversas ({conversations.length})
                </h2>
                <p className="text-sm text-gray-600">
                  Clique em uma conversa para ver as mensagens
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {conversations.map((conversation) => (
                  <ConversationPreview
                    key={conversation.id}
                    conversation={conversation}
                    currentUserId={profile.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </ClientLayout>
  );
};

export default Messages;
