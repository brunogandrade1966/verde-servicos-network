
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useConversations } from '@/hooks/useConversations';
import { useReviews } from '@/hooks/useReviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Star, 
  MessageCircle, 
  ArrowLeft, 
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  Leaf,
  Clock,
  Award,
  GraduationCap,
  FileText
} from 'lucide-react';
import DashboardNavigation from '@/components/dashboards/DashboardNavigation';
import RatingDisplay from '@/components/reviews/RatingDisplay';
import ReviewsList from '@/components/reviews/ReviewsList';

interface Professional {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  phone?: string;
  email: string;
  experience_years?: number;
  hourly_rate?: number;
  specializations?: string;
  certifications?: string;
  education?: string;
  academic_title?: string;
  professional_entity?: string;
  registration_number?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  professional_services: Array<{
    id: string;
    price_range?: string;
    experience_years?: number;
    services: {
      name: string;
      category: string;
    };
  }>;
}

const ProfessionalProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const { createConversation } = useConversations(profile?.id);
  const { reviews, loading: reviewsLoading, averageRating, totalReviews } = useReviews(id);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProfessional();
    }
  }, [id]);

  const fetchProfessional = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          bio,
          avatar_url,
          city,
          state,
          phone,
          email,
          experience_years,
          hourly_rate,
          specializations,
          certifications,
          education,
          academic_title,
          professional_entity,
          registration_number,
          linkedin_url,
          portfolio_url,
          professional_services(
            id,
            price_range,
            experience_years,
            services(name, category)
          )
        `)
        .eq('id', id)
        .eq('user_type', 'professional')
        .single();

      if (error) {
        toast({
          title: "Erro ao carregar perfil",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setProfessional(data);
    } catch (error) {
      console.error('Error fetching professional:', error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar as informações do profissional.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!profile || !professional) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para entrar em contato.",
        variant: "destructive"
      });
      return;
    }

    if (profile.user_type !== 'client') {
      toast({
        title: "Erro",
        description: "Apenas clientes podem entrar em contato com profissionais.",
        variant: "destructive"
      });
      return;
    }

    // Verificar se já existe uma conversa
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('client_id', profile.id)
      .eq('professional_id', professional.id)
      .single();

    if (existingConversation) {
      navigate('/messages');
      return;
    }

    // Criar nova conversa
    const conversation = await createConversation(profile.id, professional.id);
    if (conversation) {
      toast({
        title: "Conversa criada!",
        description: "Você pode agora trocar mensagens com o profissional."
      });
      navigate('/messages');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/professionals')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Leaf className="h-8 w-8 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Perfil do Profissional</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Profissional não encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                O perfil que você está procurando não existe ou não está disponível.
              </p>
              <Button onClick={() => navigate('/professionals')}>
                Voltar para Profissionais
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const initials = professional.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'P';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/professionals')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">Perfil do Profissional</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Professional Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={professional.avatar_url} alt={professional.name} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{professional.name}</CardTitle>
                    {professional.academic_title && (
                      <p className="text-lg text-gray-700 mb-2">{professional.academic_title}</p>
                    )}
                    
                    {/* Rating Display */}
                    <div className="mb-3">
                      <RatingDisplay 
                        rating={averageRating} 
                        totalReviews={totalReviews} 
                        size="md"
                      />
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-gray-300" />
                        <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                      </div>
                    </div>
                    {(professional.city || professional.state) && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {[professional.city, professional.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {professional.experience_years && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{professional.experience_years} anos de experiência</span>
                      </div>
                    )}
                    {professional.hourly_rate && (
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="text-sm">R$ {professional.hourly_rate}/hora</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              {professional.bio && (
                <CardContent>
                  <h3 className="font-medium text-gray-900 mb-2">Sobre</h3>
                  <p className="text-gray-600">{professional.bio}</p>
                </CardContent>
              )}
            </Card>

            {/* Serviços Habilitados */}
            {professional.professional_services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-green-600" />
                    Serviços Habilitados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {professional.professional_services.map((ps) => (
                      <div key={ps.id} className="border rounded-lg p-3 bg-gray-50">
                        <h4 className="font-medium text-gray-900 mb-1">{ps.services.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">Categoria: {ps.services.category}</p>
                        <div className="flex flex-wrap gap-2">
                          {ps.experience_years && (
                            <Badge variant="outline" className="text-xs">
                              {ps.experience_years} anos
                            </Badge>
                          )}
                          {ps.price_range && (
                            <Badge variant="outline" className="text-xs">
                              {ps.price_range}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formação Acadêmica */}
            {professional.education && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                    Formação Acadêmica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{professional.education}</p>
                </CardContent>
              </Card>
            )}

            {/* Registro Profissional */}
            {(professional.professional_entity || professional.registration_number) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    Registro Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {professional.professional_entity && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Entidade de Classe</h4>
                      <p className="text-gray-700">{professional.professional_entity}</p>
                    </div>
                  )}
                  {professional.registration_number && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Número de Registro</h4>
                      <p className="text-gray-700">{professional.registration_number}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Certificações */}
            {professional.certifications && professional.certifications !== '[]' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-orange-600" />
                    Certificações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{professional.certifications}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Avaliações ({totalReviews})
              </CardTitle>
              {totalReviews > 0 && (
                <div className="mt-2">
                  <RatingDisplay 
                    rating={averageRating} 
                    totalReviews={totalReviews} 
                    size="lg"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <ReviewsList reviews={reviews} loading={reviewsLoading} />
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.user_type === 'client' && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleContact}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Entrar em Contato
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => console.log('Solicitar orçamento')}
                >
                  Solicitar Orçamento
                </Button>
              </CardContent>
            </Card>

            {/* Links */}
            {(professional.linkedin_url || professional.portfolio_url) && (
              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {professional.linkedin_url && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => window.open(professional.linkedin_url, '_blank')}
                    >
                      LinkedIn
                    </Button>
                  )}
                  {professional.portfolio_url && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => window.open(professional.portfolio_url, '_blank')}
                    >
                      Portfólio
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalProfileView;
