
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface StartPartnershipConversationProps {
  partnershipDemandId: string;
  creatorId: string;
  applicantId: string;
  disabled?: boolean;
}

const StartPartnershipConversation = ({ 
  partnershipDemandId, 
  creatorId, 
  applicantId,
  disabled 
}: StartPartnershipConversationProps) => {
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const { createConversation } = useConversations(profile?.id);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartConversation = async () => {
    if (!profile?.id || disabled) return;

    setLoading(true);
    try {
      const conversation = await createConversation(
        creatorId,
        applicantId,
        partnershipDemandId
      );

      if (conversation) {
        toast({
          title: "Conversa iniciada",
          description: "Você será redirecionado para a página de mensagens."
        });
        navigate('/messages');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleStartConversation}
      disabled={loading || disabled}
      className="bg-orange-600 hover:bg-orange-700"
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {loading ? 'Iniciando...' : 'Iniciar Conversa'}
    </Button>
  );
};

export default StartPartnershipConversation;
