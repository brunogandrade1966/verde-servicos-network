
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useCepSearch } from '@/hooks/useCepSearch';

interface CepSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onAddressFound: (address: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
  }) => void;
  label?: string;
  required?: boolean;
}

const CepSearchField = ({ 
  value, 
  onChange, 
  onAddressFound, 
  label = "CEP",
  required = false 
}: CepSearchFieldProps) => {
  const { searchCep, loading } = useCepSearch();
  const [cepValue, setCepValue] = useState(value);

  const formatCep = (cep: string) => {
    const numbers = cep.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return numbers.replace(/(\d{5})(\d{1,3})/, '$1-$2');
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCepValue(formatted);
    onChange(formatted);
  };

  const handleSearchCep = async () => {
    const cepData = await searchCep(cepValue);
    if (cepData) {
      onAddressFound({
        address: cepData.logradouro,
        neighborhood: cepData.bairro,
        city: cepData.localidade,
        state: cepData.uf
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchCep();
    }
  };

  return (
    <div>
      <Label htmlFor="postal_code">
        {label} {required && '*'}
      </Label>
      <div className="flex gap-2">
        <Input
          id="postal_code"
          value={cepValue}
          onChange={handleCepChange}
          onKeyPress={handleKeyPress}
          placeholder="00000-000"
          maxLength={9}
          required={required}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleSearchCep}
          disabled={loading || !cepValue}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default CepSearchField;
