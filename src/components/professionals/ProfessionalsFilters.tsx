
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
}

interface ProfessionalsFiltersProps {
  searchQuery: string;
  selectedService: string;
  selectedCategory: string;
  services: Service[];
  onSearchChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const ProfessionalsFilters = ({
  searchQuery,
  selectedService,
  selectedCategory,
  services,
  onSearchChange,
  onServiceChange,
  onCategoryChange
}: ProfessionalsFiltersProps) => {
  const categories = [...new Set(services.map(s => s.category))];

  const handleCategoryChange = (value: string) => {
    // Convert "all" back to empty string for filtering logic
    onCategoryChange(value === "all" ? "" : value);
  };

  const handleServiceChange = (value: string) => {
    // Convert "all" back to empty string for filtering logic
    onServiceChange(value === "all" ? "" : value);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Filtros de Busca</CardTitle>
        <CardDescription>
          Use os filtros abaixo para encontrar o profissional ideal para seu projeto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou especialidade..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedService || "all"} onValueChange={handleServiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os serviços</SelectItem>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.name}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalsFilters;
