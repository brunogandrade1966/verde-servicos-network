import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Mail, Phone } from 'lucide-react';
import StartPartnershipConversation from '@/components/partnerships/StartPartnershipConversation';
import PartnershipStatusUpdater from '@/components/partnerships/PartnershipStatusUpdater';
import ServiceCompletionConfirmation from '@/components/reviews/ServiceCompletionConfirmation';
import MutualReviewSystem from '@/components/reviews/MutualReviewSystem';

interface PartnershipDemand {
  id: string;
  title: string;
  description: string;
  collaboration_type: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  location?: string;
  required_skills?: string;
  created_at: string;
  status: string;
  professional_id: string;
  services: {
    name: string;
    category: string;
  };
  profiles: {
    name: string;
    avatar_url?: string;
    bio?: string;
    email: string;
    phone?: string;
    whatsapp?: string;
  };
}

interface Application {
  id: string;
  professional_id: string;
  proposal: string;
  proposed_price?: number;
  estimated_duration?: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
  professional?: {
    name: string;
    avatar_url?: string;
    area_of_expertise?: string;
  };
}

const PartnershipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [demand, setDemand] = useState<PartnershipDemand | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (id) {
      fetchPartnershipDemand();
    }
  }, [id]);

  const fetchPartnershipDemand = async () => {
    try {
      const { data, error } = await supabase
        .from('partnership_demands')
        .select(`
          *,
          services(name, category),
          profiles(name, avatar_url, bio, email, phone, whatsapp)
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Erro ao carregar demanda",
          description: error.message,
          variant: "destructive"
        });
        navigate('/partnerships');
      } else {
        setDemand(data);
        fetchApplications();
      }
    } catch (error) {
      console.error('Error fetching partnership demand:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('partnership_applications')
        .select(`
          *,
          professional:profiles!partnership_applications_professional_id_fkey(name, avatar_url, area_of_expertise)
        `)
        .eq('partnership_demand_id', id);

      if (error) {
        toast({
          title: "Erro ao carregar candidaturas",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setApplications(data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const getCollaborationTypeLabel = (type: string) => {
    const types = {
      complementary: 'Complementar',
      joint: 'Conjunta',
      subcontract: 'Subcontratação'
    };
    return types[type as keyof typeof types] || type;
  };

  const getCollaborationTypeColor = (type: string) => {
    const colors = {
      complementary: 'bg-blue-100 text-blue-800',
      joint: 'bg-green-100 text-green-800',
      subcontract: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`;
    if (min) return `A partir de R$ ${min.toLocaleString()}`;
    if (max) return `Até R$ ${max.toLocaleString()}`;
    return null;
  };

  const handleApply = () => {
    navigate(`/partnerships/${id}/apply`);
  };

  const isOwnDemand = profile?.id === demand?.professional_id;
  const hasApplied = applications.some(app => app.professional_id === profile?.id);
  const canApply = !isOwnDemand && !hasApplied && demand?.status === 'open';

  const updateApplicationStatus = async (applicationId: string, status: 'pending' | 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('partnership_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) {
        toast({
          title: "Erro ao atualizar status da candidatura",
          description: error.message,
          variant: "destructive"
        });
      } else {
        fetchApplications();
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <p>Carregando demanda...</p>
      </div>
    );
  }

  if (!demand) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <p>Demanda não encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/partnerships')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Detalhes da Demanda de Parceria</h1>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{demand.services.category}</Badge>
                    <Badge className={getCollaborationTypeColor(demand.collaboration_type)}>
                      {getCollaborationTypeLabel(demand.collaboration_type)}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{demand.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Descrição do Projeto</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{demand.description}</p>
                    </div>

                    {demand.required_skills && (
                      <div>
                        <h3 className="font-semibold mb-2">Habilidades/Especialidades Requeridas</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{demand.required_skills}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {demand.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <span>{demand.location}</span>
                        </div>
                      )}
                      
                      {demand.deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <span>Prazo: {new Date(demand.deadline).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                      
                      {formatBudget(demand.budget_min, demand.budget_max) && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <span>{formatBudget(demand.budget_min, demand.budget_max)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Candidaturas ({applications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma candidatura ainda.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Avatar className="h-10 w-10">
                                <AvatarImage 
                                  src={application.professional?.avatar_url} 
                                  alt={application.professional?.name} 
                                />
                                <AvatarFallback>
                                  {application.professional?.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{application.professional?.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {application.professional?.area_of_expertise}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{application.proposal}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Valor: R$ {application.proposed_price?.toLocaleString('pt-BR')}</span>
                              {application.estimated_duration && (
                                <span>Duração: {application.estimated_duration}</span>
                              )}
                              <span>
                                {new Date(application.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Badge 
                              variant={
                                application.status === 'accepted' ? 'default' :
                                application.status === 'rejected' ? 'destructive' : 'secondary'
                              }
                            >
                              {application.status === 'pending' && 'Pendente'}
                              {application.status === 'accepted' && 'Aceita'}
                              {application.status === 'rejected' && 'Rejeitada'}
                            </Badge>
                            {isOwnDemand && application.status === 'pending' && (
                              <div className="flex flex-col space-y-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => updateApplicationStatus(application.id, 'accepted')}
                                >
                                  Aceitar
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                >
                                  Rejeitar
                                </Button>
                              </div>
                            )}
                            {(isOwnDemand || application.professional_id === profile?.id) && (
                              <StartPartnershipConversation
                                partnershipDemandId={demand?.id || ''}
                                creatorId={demand?.professional_id || ''}
                                applicantId={application.professional_id}
                                disabled={!demand?.id}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Perfil do Profissional */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={demand.profiles.avatar_url} />
                      <AvatarFallback>
                        {demand.profiles.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{demand.profiles.name}</h4>
                      <p className="text-sm text-gray-600">
                        Publicado em {new Date(demand.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {demand.profiles.bio && (
                    <p className="text-sm text-gray-600 mb-4">{demand.profiles.bio}</p>
                  )}

                  <div className="space-y-2">
                    {demand.profiles.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{demand.profiles.email}</span>
                      </div>
                    )}
                    
                    {demand.profiles.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{demand.profiles.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Ações */}
              {canApply && (
                <Card>
                  <CardHeader>
                    <CardTitle>Candidatar-se</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                      onClick={handleApply}
                    >
                      Enviar Candidatura
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Envie sua proposta para formar parceria neste projeto
                    </p>
                  </CardContent>
                </Card>
              )}

              {profile?.id === demand.professional_id && (
                <Card>
                  <CardHeader>
                    <CardTitle>Suas Ações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full">
                      Ver Candidaturas
                    </Button>
                    <Button variant="outline" className="w-full">
                      Editar Demanda
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PartnershipDetails;
