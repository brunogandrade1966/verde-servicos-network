
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Linkedin, 
  GraduationCap, 
  Award,
  Star,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ClientLayout from '@/components/layout/ClientLayout';

interface ProfessionalProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  area_of_expertise?: string;
  academic_title?: string;
  city?: string;
  state?: string;
  experience_years?: number;
  skills?: string[];
  education?: string;
  website?: string;
  linkedin_url?: string;
  phone?: string;
  professional_entity?: string;
  registration_number?: string;
  specializations?: string[];
  hourly_rate?: number;
  availability?: string;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

const ProfessionalProfileView = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const { toast } = useToast();
  const { profile: currentUser } = useAuth();
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchProfessionalProfile();
    fetchReviews();
  }, [professionalId]);

  const fetchProfessionalProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', professionalId)
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

      // Parse campos JSON se existirem e não forem null
      const professionalData = {
        ...data,
        skills: data.skills ? JSON.parse(data.skills) : [],
        specializations: data.specializations ? JSON.parse(data.specializations) : [],
      };

      setProfessional(professionalData);
    } catch (error) {
      console.error('Error fetching professional profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewed_id', professionalId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleStartConversation = async () => {
    if (!currentUser || !professional) return;

    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O sistema de mensagens será implementado em breve.",
    });
  };
  
  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </ClientLayout>
    );
  }

  if (!professional) {
    return (
      <ClientLayout>
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Profissional não encontrado
            </h3>
            <p className="text-gray-500">
              O perfil que você está procurando não existe ou foi removido.
            </p>
          </CardContent>
        </Card>
      </ClientLayout>
    );
  }

  const initials = professional.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'PR';

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Header */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={professional.avatar_url} alt={professional.name} />
                    <AvatarFallback className="text-2xl bg-green-100 text-green-600">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{professional.name}</h1>
                        <p className="text-xl text-green-600 font-medium">{professional.area_of_expertise}</p>
                        <p className="text-gray-600">{professional.academic_title}</p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          {professional.city && professional.state && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {professional.city}, {professional.state}
                            </div>
                          )}
                          {professional.experience_years && (
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1" />
                              {professional.experience_years} anos de experiência
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 mt-4 md:mt-0">
                        {currentUser?.user_type === 'client' && (
                          <Button onClick={handleStartConversation}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Enviar Mensagem
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {professional.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>Sobre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{professional.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {professional.skills && professional.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Habilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {professional.education && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Formação Acadêmica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{professional.education}</p>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Avaliações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {professional.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{professional.email}</span>
                  </div>
                )}
                
                {professional.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{professional.phone}</span>
                  </div>
                )}

                {professional.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a 
                      href={professional.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}

                {professional.linkedin_url && (
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-4 w-4 text-gray-400" />
                    <a 
                      href={professional.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {professional.professional_entity && professional.registration_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registro Profissional</p>
                    <p className="text-sm">{professional.professional_entity}: {professional.registration_number}</p>
                  </div>
                )}

                {professional.hourly_rate && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa por Hora</p>
                    <p className="text-sm">R$ {professional.hourly_rate.toLocaleString()}</p>
                  </div>
                )}

                {professional.availability && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Disponibilidade</p>
                    <p className="text-sm">{professional.availability}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specializations */}
            {professional.specializations && professional.specializations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Especializações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {professional.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ProfessionalProfileView;
