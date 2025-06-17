
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';

interface ContactInfoSectionProps {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
}

const ContactInfoSection = ({ formData, onInputChange }: ContactInfoSectionProps) => {
  return (
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
              onChange={(e) => onInputChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
              required
            />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp || ''}
              onChange={(e) => onInputChange('whatsapp', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoSection;
