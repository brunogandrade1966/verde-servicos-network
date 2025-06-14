
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User, Award, MapPin, Save, Plus, X } from 'lucide-react';
import AvatarUpload from './AvatarUpload';

interface ProfessionalProfileData {
  name: string;
  email: string;
  phone: string;
  document: string;
  avatar_url?: string;
  bio?: string;
  education?: string;
  experience_years?: number;
  specializations?: string[];
  certifications?: string[];
  languages?: string[];
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  availability?: string;
  hourly_rate?: number;
}

interface ProfessionalProfileFormProps {
  profile: ProfessionalProfileData;
  userId: string;
  onSave: (data: Partial<ProfessionalProfileData>) => Promise<void>;
  loading: boolean;
}

const ProfessionalProfileForm = ({ profile, userId, onSave, loading }: ProfessionalProfileFormProps) => {
  const [formData, setFormData] = useState<ProfessionalProfileData>(profile);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const handleInputChange = (field: keyof ProfessionalProfileData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayField = (field: 'specializations' | 'certifications' | 'languages', action: 'add' | 'remove', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      if (action === 'add' && value && !currentArray.includes(value)) {
        return { ...prev, [field]: [...currentArray, value] };
      } else if (action === 'remove') {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const availabilityOptions = [
    'Disponível para novos projetos',
    'Parcialmente disponível',
    'Indisponível no momento',
    'Apenas projetos de longo prazo',
    'Apenas projetos urgentes'
  ];

  const languageOptions = [
    'Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Japonês', 'Mandarim'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar e Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>
              Adicione uma foto profissional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvatarUpload
              currentAvatar={formData.avatar_url}
              onAvatarChange={(url) => handleInputChange('avatar_url', url)}
              userId={userId}
              userName={formData.name}
            />
          </CardContent>
        </Card>

        {/* Informações Pessoais */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informações Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="document">CPF</Label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(e) => handleInputChange('document', e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Sobre você</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Conte sobre sua experiência, especialidades e metodologia de trabalho..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formação e Experiência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Formação e Experiência</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="education">Formação Acadêmica</Label>
              <Textarea
                id="education"
                value={formData.education || ''}
                onChange={(e) => handleInputChange('education', e.target.value)}
                placeholder="Ex: Engenharia Ambiental - USP (2020)"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="experience_years">Anos de Experiência</Label>
              <Input
                id="experience_years"
                type="number"
                min="0"
                max="50"
                value={formData.experience_years || ''}
                onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                placeholder="Ex: 5"
              />
            </div>
          </div>

          {/* Especializações */}
          <div>
            <Label>Especializações</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Ex: Licenciamento Ambiental"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleArrayField('specializations', 'add', newSpecialization);
                    setNewSpecialization('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleArrayField('specializations', 'add', newSpecialization);
                  setNewSpecialization('');
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specializations?.map((spec, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {spec}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => handleArrayField('specializations', 'remove', spec)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Certificações */}
          <div>
            <Label>Certificações</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Ex: ISO 14001 Lead Auditor"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleArrayField('certifications', 'add', newCertification);
                    setNewCertification('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleArrayField('certifications', 'add', newCertification);
                  setNewCertification('');
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.certifications?.map((cert, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {cert}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => handleArrayField('certifications', 'remove', cert)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div>
            <Label>Idiomas</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {languageOptions.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={language}
                    checked={formData.languages?.includes(language) || false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleArrayField('languages', 'add', language);
                      } else {
                        handleArrayField('languages', 'remove', language);
                      }
                    }}
                  />
                  <Label htmlFor={language} className="text-sm">{language}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Profissionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Profissionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="availability">Disponibilidade</Label>
              <Select 
                value={formData.availability || ''} 
                onValueChange={(value) => handleInputChange('availability', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua disponibilidade" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hourly_rate">Valor por Hora (R$)</Label>
              <Input
                id="hourly_rate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourly_rate || ''}
                onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
                placeholder="Ex: 150.00"
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/seu-perfil"
              />
            </div>
            <div>
              <Label htmlFor="portfolio_url">Portfolio/Website</Label>
              <Input
                id="portfolio_url"
                value={formData.portfolio_url || ''}
                onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                placeholder="https://seu-portfolio.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Localização</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua, número, bairro"
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Sua cidade"
              />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="SP"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        disabled={loading}
        className="bg-green-600 hover:bg-green-700"
        size="lg"
      >
        <Save className="h-4 w-4 mr-2" />
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
};

export default ProfessionalProfileForm;
