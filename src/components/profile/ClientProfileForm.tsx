import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Save } from 'lucide-react';
import AvatarUpload from './AvatarUpload';
import CepSearchField from './CepSearchField';

interface ClientProfileData {
  name: string;
  email: string;
  phone?: string;
  document?: string;
  avatar_url?: string;
  bio?: string;
  company_name?: string;
  company_size?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}

interface ClientProfileFormProps {
  profile: ClientProfileData;
  userId: string;
  onSave: (data: Partial<ClientProfileData>) => Promise<void>;
  loading: boolean;
}

const ClientProfileForm = ({ profile, userId, onSave, loading }: ClientProfileFormProps) => {
  const [formData, setFormData] = useState<ClientProfileData>(profile);

  const handleInputChange = (field: keyof ClientProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressFound = (address: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      address: address.address,
      city: address.city,
      state: address.state
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const companySizes = [
    'Microempresa (até 9 funcionários)',
    'Pequena empresa (10-49 funcionários)', 
    'Média empresa (50-249 funcionários)',
    'Grande empresa (250+ funcionários)',
    'Pessoa física'
  ];

  const industries = [
    'Agricultura e Pecuária',
    'Indústria de Transformação',
    'Construção Civil',
    'Energia e Utilities',
    'Mineração',
    'Petróleo e Gás',
    'Transporte e Logística',
    'Tecnologia',
    'Serviços',
    'Governo e Setor Público',
    'ONGs e Terceiro Setor',
    'Outros'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar e Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>
              Adicione uma foto para personalizar seu perfil
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
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Mantenha seus dados atualizados
            </CardDescription>
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
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="document">CPF/CNPJ</Label>
                <Input
                  id="document"
                  value={formData.document || ''}
                  onChange={(e) => handleInputChange('document', e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Sobre você/empresa</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Conte um pouco sobre você ou sua empresa..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Informações da Empresa</span>
          </CardTitle>
          <CardDescription>
            Informações sobre sua empresa (opcional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                value={formData.company_name || ''}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Nome da sua empresa"
              />
            </div>
            <div>
              <Label htmlFor="company_size">Porte da Empresa</Label>
              <Select 
                value={formData.company_size || ''} 
                onValueChange={(value) => handleInputChange('company_size', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o porte" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="industry">Setor de Atuação</Label>
              <Select 
                value={formData.industry || ''} 
                onValueChange={(value) => handleInputChange('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <CardDescription>
            Informações de localização (opcional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CepSearchField
              value={formData.postal_code || ''}
              onChange={(value) => handleInputChange('postal_code', value)}
              onAddressFound={handleAddressFound}
              label="CEP"
            />
          </div>
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

export default ClientProfileForm;
