
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';

interface RegistrationSectionProps {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
}

const RegistrationSection = ({ formData, onInputChange }: RegistrationSectionProps) => {
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
              onValueChange={(value) => onInputChange('professional_entity', value)}
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
              onChange={(e) => onInputChange('registration_number', e.target.value)}
              placeholder="Ex: 123456/D-SP"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationSection;
