
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Briefcase } from 'lucide-react';
import PersonalInfoSection from './PersonalInfoSection';
import ContactInfoSection from './ContactInfoSection';
import ProfessionalLinksSection from './ProfessionalLinksSection';
import ProfessionalInfoSection from './ProfessionalInfoSection';
import RegistrationSection from './RegistrationSection';
import AddressSection from './AddressSection';
import ServicesSelector from './ServicesSelector';

interface ProfessionalProfileData {
  name: string;
  email: string;
  phone?: string;
  document?: string;
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

  const handleInputChange = (field: keyof ProfessionalProfileData, value: string | number) => {
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
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfoSection
        formData={formData}
        onInputChange={handleInputChange}
        userId={userId}
      />

      <ContactInfoSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      <ProfessionalLinksSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      <ProfessionalInfoSection
        formData={formData}
        onInputChange={handleInputChange}
        onArrayFieldChange={handleArrayField}
      />

      {/* Serviços Oferecidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>Serviços Oferecidos</span>
          </CardTitle>
          <CardDescription>
            Selecione os serviços que você está habilitado a oferecer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServicesSelector
            professionalId={userId}
            onServicesChange={() => {
              // Callback para quando os serviços mudarem, se necessário
            }}
          />
        </CardContent>
      </Card>

      <RegistrationSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      <AddressSection
        formData={formData}
        onInputChange={handleInputChange}
        onAddressFound={handleAddressFound}
      />

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
