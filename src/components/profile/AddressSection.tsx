
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import CepSearchField from './CepSearchField';

interface AddressSectionProps {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
  onAddressFound: (address: any) => void;
}

const AddressSection = ({ formData, onInputChange, onAddressFound }: AddressSectionProps) => {
  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Endereço</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CepSearchField
            value={formData.postal_code || ''}
            onChange={(value) => onInputChange('postal_code', value)}
            onAddressFound={onAddressFound}
            label="CEP"
            required
          />
          <div className="md:col-span-2">
            <Label htmlFor="address">Endereço *</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => onInputChange('address', e.target.value)}
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
              onChange={(e) => onInputChange('address_number', e.target.value)}
              placeholder="123"
              required
            />
          </div>
          <div>
            <Label htmlFor="address_complement">Complemento</Label>
            <Input
              id="address_complement"
              value={formData.address_complement || ''}
              onChange={(e) => onInputChange('address_complement', e.target.value)}
              placeholder="Apto 45"
            />
          </div>
          <div>
            <Label htmlFor="neighborhood">Bairro *</Label>
            <Input
              id="neighborhood"
              value={formData.neighborhood || ''}
              onChange={(e) => onInputChange('neighborhood', e.target.value)}
              placeholder="Centro"
              required
            />
          </div>
          <div>
            <Label htmlFor="city">Cidade *</Label>
            <Input
              id="city"
              value={formData.city || ''}
              onChange={(e) => onInputChange('city', e.target.value)}
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
              onValueChange={(value) => onInputChange('state', value)}
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
  );
};

export default AddressSection;
