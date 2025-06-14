
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Application {
  id: string;
  proposed_price?: number;
  proposal: string;
  status: string;
  estimated_duration?: string;
  created_at: string;
  profiles: {
    id: string;
    name: string;
    bio?: string;
    avatar_url?: string;
  };
}

interface Profile {
  id?: string;
  user_type?: string;
}

interface ProjectApplicationsProps {
  applications: Application[];
  profile: Profile | null;
  onApplicationUpdate?: () => void;
}

const ProjectApplications = ({ applications, profile, onApplicationUpdate }: ProjectApplicationsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewProfile = (professionalId: string) => {
    navigate(`/professionals/${professionalId}`);
  };

  const handleAcceptApplication = async (applicationId: string, professionalName: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (error) {
        console.error('Error accepting application:', error);
        toast({
          title: "Erro ao aceitar candidatura",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Candidatura aceita!",
        description: `A candidatura de ${professionalName} foi aceita. O projeto foi automaticamente movido para "Em Andamento" e outras candidaturas foram rejeitadas.`
      });

      // Atualizar a lista de candidaturas
      if (onApplicationUpdate) {
        onApplicationUpdate();
      }
    } catch (error) {
      console.error('Error accepting application:', error);
      toast({
        title: "Erro ao aceitar candidatura",
        description: "Não foi possível aceitar a candidatura. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Candidaturas ({applications?.length || 0})
        </CardTitle>
        <CardDescription>
          Profissionais interessados neste projeto
        </CardDescription>
      </CardHeader>
      <CardContent>
        {applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {application.profiles?.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(application.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    application.status === 'pending' ? 'secondary' : 
                    application.status === 'accepted' ? 'default' :
                    application.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {application.status === 'pending' ? 'Pendente' : 
                     application.status === 'accepted' ? 'Aceita' : 
                     application.status === 'rejected' ? 'Rejeitada' : application.status}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-3">{application.proposal}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    {application.proposed_price && (
                      <span className="text-green-600 font-medium">
                        {formatCurrency(application.proposed_price)}
                      </span>
                    )}
                    {application.estimated_duration && (
                      <span className="text-gray-500">
                        Prazo: {application.estimated_duration}
                      </span>
                    )}
                  </div>
                  {profile?.user_type === 'client' && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewProfile(application.profiles.id)}
                      >
                        Ver Perfil
                      </Button>
                      {application.status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptApplication(application.id, application.profiles.name)}
                        >
                          Aceitar
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhuma candidatura recebida ainda.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectApplications;
