
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConversationsList from '@/components/messages/ConversationsList';
import MessagesList from '@/components/messages/MessagesList';
import MessageInput from '@/components/messages/MessageInput';

const Messages = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  
  const { conversations, loading: conversationsLoading } = useConversations(profile?.id);
  const { messages, sendMessage, loading: messagesLoading } = useMessages(selectedConversationId);

  const handleSendMessage = async (content: string) => {
    if (profile?.id) {
      await sendMessage(content, profile.id);
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">Mensagens</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Lista de Conversas */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversas</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-96">
              {conversationsLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Carregando conversas...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhuma conversa encontrada
                </div>
              ) : (
                <div className="p-4">
                  <ConversationsList
                    conversations={conversations}
                    selectedConversationId={selectedConversationId}
                    onConversationSelect={setSelectedConversationId}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Área de Mensagens */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle>
                    {profile?.id === selectedConversation.client_id 
                      ? selectedConversation.professional?.name 
                      : selectedConversation.client?.name}
                  </CardTitle>
                </CardHeader>
                <div className="flex-1 flex flex-col">
                  {messagesLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-gray-500">Carregando mensagens...</p>
                    </div>
                  ) : (
                    <MessagesList messages={messages} />
                  )}
                  <MessageInput onSendMessage={handleSendMessage} />
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Selecione uma conversa para começar a trocar mensagens
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Messages;
