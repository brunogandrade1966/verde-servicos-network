
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import AvatarUpload from './AvatarUpload';

interface PersonalInfoSectionProps {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
  userId: string;
}

const PersonalInfoSection = ({ formData, onInputChange, userId }: PersonalInfoSectionProps) => {
  return (
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
            onAvatarChange={(url) => onInputChange('avatar_url', url)}
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
                onChange={(e) => onInputChange('name', e.target.value)}
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
                onChange={(e) => onInputChange('document', e.target.value)}
                placeholder="000.000.000-00 ou 00.000.000/0001-00"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoSection;
