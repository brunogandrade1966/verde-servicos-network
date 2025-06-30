
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign, Users, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';
import type { Database } from '@/integrations/supabase/types';

type ProjectStatus = Database['public']['Enums']['project_status'];

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
  status: ProjectStatus;
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

interface PartnershipReadOnlyViewProps {
  demand: PartnershipDemand;
}

const PartnershipReadOnlyView = ({ demand }: PartnershipReadOnlyViewProps) => {
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

  // Timeline simples para parcerias finalizadas
  const timelineEvents = [
    {
      status: 'draft' as ProjectStatus,
      date: demand.created_at,
      note: 'Demanda de parceria criada'
    },
    {
      status: 'completed' as ProjectStatus,
      date: demand.created_at, // Seria ideal ter a data real de conclusão
      note: 'Parceria concluída'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Badge variant="outline">Parceria Finalizada</Badge>
          <ProjectStatusBadge status={demand.status} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{demand.title}</h1>
        <p className="text-gray-600 mt-2">{demand.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Card com detalhes da parceria */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{demand.services.category}</Badge>
                <Badge className={getCollaborationTypeColor(demand.collaboration_type)}>
                  {getCollaborationTypeLabel(demand.collaboration_type)}
                </Badge>
              </div>
              <CardTitle className="text-2xl">Detalhes da Parceria</CardTitle>
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

          {/* Timeline da Parceria */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline da Parceria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <ProjectStatusBadge status={event.status} />
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com informações do profissional */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Profissional Criador
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
                    Criado em {new Date(demand.created_at).toLocaleDateString('pt-BR')}
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

          {/* Informações do Serviço */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Serviço:</span>
                  <p className="text-sm text-gray-600">{demand.services.name}</p>
                </div>
                <div>
                  <span className="font-medium">Categoria:</span>
                  <p className="text-sm text-gray-600">{demand.services.category}</p>
                </div>
                <div>
                  <span className="font-medium">Tipo de Colaboração:</span>
                  <p className="text-sm text-gray-600">
                    {getCollaborationTypeLabel(demand.collaboration_type)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnershipReadOnlyView;
