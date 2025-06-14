
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Leaf, ArrowLeft, Star, MapPin, Clock, DollarSign } from 'lucide-react';

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

  const handleContact = () => {
    if (professional?.phone) {
      window.open(`https://wa.me/55${professional.phone.replace(/\D/g, '')}`, '_blank');
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

            {/* Services */}
            {professional.professional_services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Especialidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.professional_services.map((ps) => (
                      <Badge key={ps.id} variant="outline">
                        {ps.services.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education & Certifications */}
            {(professional.education || professional.certifications) && (
              <Card>
                <CardHeader>
                  <CardTitle>Formação e Certificações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {professional.education && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Formação</h4>
                      <p className="text-gray-600">{professional.education}</p>
                    </div>
                  )}
                  {professional.certifications && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Certificações</h4>
                      <p className="text-gray-600">{professional.certifications}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {professional.phone && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleContact}
                  >
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
