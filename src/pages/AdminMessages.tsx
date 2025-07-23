import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  sender?: {
    name: string;
  };
  conversation?: {
    client?: {
      name: string;
    };
    professional?: {
      name: string;
    };
  };
}

const AdminMessages = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    today: 0
  });

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadMessages();
    loadStats();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(name),
          conversation:conversations(
            client:profiles!conversations_client_id_fkey(name),
            professional:profiles!conversations_professional_id_fkey(name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Total de mensagens
      const { count: total } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Mensagens não lidas
      const { count: unread } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .is('read_at', null);

      // Mensagens de hoje
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      setStats({
        total: total || 0,
        unread: unread || 0,
        today: todayCount || 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const searchLower = searchTerm.toLowerCase();
    return message.content.toLowerCase().includes(searchLower) ||
           message.sender?.name.toLowerCase().includes(searchLower) ||
           message.conversation?.client?.name.toLowerCase().includes(searchLower) ||
           message.conversation?.professional?.name.toLowerCase().includes(searchLower);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Mensagens</h1>
          <p className="text-gray-600">Monitore e gerencie mensagens da plataforma</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Mensagens</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Não Lidas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Buscar mensagens por conteúdo ou usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Mensagens Recentes ({filteredMessages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{message.sender?.name}</span>
                          {!message.read_at && (
                            <Badge variant="destructive" className="text-xs">Não lida</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Conversa: {message.conversation?.client?.name} ↔ {message.conversation?.professional?.name}
                        </p>
                        <p className="text-sm">{truncateContent(message.content)}</p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>{formatDate(message.created_at)}</p>
                        {message.read_at && (
                          <p className="text-green-600">Lida em {formatDate(message.read_at)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhuma mensagem encontrada.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;