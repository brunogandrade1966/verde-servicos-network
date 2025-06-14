
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Award, MapPin, Save, Plus, X, Phone, Link, GraduationCap, Building, FileText } from 'lucide-react';
import AvatarUpload from './AvatarUpload';

interface ProfessionalProfileData {
  name: string;
  email: string;
  phone?: string;
  document: string;
  avatar_url?: string;
  bio?: string;
  // Informações de Contato
  whatsapp?: string;
  // Links Profissionais
  website?: string;
  linkedin_url?: string;
  lattes_url?: string;
  // Informações Profissionais
  academic_title?: string;
  area_of_expertise?: string;
  skills?: string[];
  education?: string;
  // Registro Profissional
  professional_entity?: string;
  registration_number?: string;
  // Endereço
  postal_code?: string;
  address?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  // Campos existentes
  experience_years?: number;
  specializations?: string[];
  certifications?: string[];
  languages?: string[];
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
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: keyof ProfessionalProfileData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayField = (field: 'skills' | 'specializations' | 'certifications' | 'languages', action: 'add' | 'remove', value: string) => {
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

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const academicTitles = [
    'Graduação',
    'Especialização',
    'MBA',
    'Mestrado',
    'Doutorado',
    'Pós-Doutorado'
  ];

  const professionalEntities = [
    'CREA',
    'CRBio',
    'CRQ',
    'CONFEA',
    'CRF',
    'CRM',
    'OAB',
    'CRC',
    'CORECON',
    'CAU',
    'Outro'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Foto de Perfil */}
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>
              Tamanho máximo: 5MB<br />
              Formatos: JPG, PNG
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
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Seu nome completo"
                  required
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
                <Label htmlFor="document">CPF/CNPJ *</Label>
                <Input
                  id="document"
                  value={formData.document || ''}
                  onChange={(e) => handleInputChange('document', e.target.value)}
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Informações de Contato</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp || ''}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Profissionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link className="h-5 w-5" />
            <span>Links Profissionais</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://seu-website.com"
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
              <Label htmlFor="lattes_url">Currículo Lattes</Label>
              <Input
                id="lattes_url"
                value={formData.lattes_url || ''}
                onChange={(e) => handleInputChange('lattes_url', e.target.value)}
                placeholder="http://lattes.cnpq.br/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Profissionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Informações Profissionais</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="academic_title">Título Acadêmico *</Label>
              <Select 
                value={formData.academic_title || ''} 
                onValueChange={(value) => handleInputChange('academic_title', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu título acadêmico" />
                </SelectTrigger>
                <SelectContent>
                  {academicTitles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="area_of_expertise">Área de Atuação *</Label>
              <Input
                id="area_of_expertise"
                value={formData.area_of_expertise || ''}
                onChange={(e) => handleInputChange('area_of_expertise', e.target.value)}
                placeholder="Ex: Engenharia Ambiental"
                required
              />
            </div>
          </div>

          {/* Habilidades e Competências */}
          <div>
            <Label>Habilidades e Competências *</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Ex: Licenciamento Ambiental"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleArrayField('skills', 'add', newSkill);
                    setNewSkill('');
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleArrayField('skills', 'add', newSkill);
                  setNewSkill('');
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills?.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => handleArrayField('skills', 'remove', skill)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Formação Acadêmica */}
          <div>
            <Label htmlFor="education">Formação Acadêmica *</Label>
            <Textarea
              id="education"
              value={formData.education || ''}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="Ex: Engenharia Ambiental - USP (2020)"
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Registro Profissional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Registro Profissional</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="professional_entity">Entidade de Classe *</Label>
              <Select 
                value={formData.professional_entity || ''} 
                onValueChange={(value) => handleInputChange('professional_entity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a entidade" />
                </SelectTrigger>
                <SelectContent>
                  {professionalEntities.map((entity) => (
                    <SelectItem key={entity} value={entity}>
                      {entity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="registration_number">Número do Registro *</Label>
              <Input
                id="registration_number"
                value={formData.registration_number || ''}
                onChange={(e) => handleInputChange('registration_number', e.target.value)}
                placeholder="Ex: 123456/D-SP"
                required
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
            <span>Endereço</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="postal_code">CEP *</Label>
              <Input
                id="postal_code"
                value={formData.postal_code || ''}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="00000-000"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Nome da rua"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="address_number">Número *</Label>
              <Input
                id="address_number"
                value={formData.address_number || ''}
                onChange={(e) => handleInputChange('address_number', e.target.value)}
                placeholder="123"
                required
              />
            </div>
            <div>
              <Label htmlFor="address_complement">Complemento</Label>
              <Input
                id="address_complement"
                value={formData.address_complement || ''}
                onChange={(e) => handleInputChange('address_complement', e.target.value)}
                placeholder="Apto 45"
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood || ''}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                placeholder="Centro"
                required
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="São Paulo"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="state">Estado *</Label>
              <Select 
                value={formData.state || ''} 
                onValueChange={(value) => handleInputChange('state', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
