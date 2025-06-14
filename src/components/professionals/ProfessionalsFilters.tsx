
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
}

interface ProfessionalsFiltersProps {
  searchQuery: string;
  selectedService: string;
  selectedCategory: string;
  selectedCity: string;
  selectedState: string;
  services: Service[];
  cities: string[];
  states: string[];
  onSearchChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
}

const ProfessionalsFilters = ({
  searchQuery,
  selectedService,
  selectedCategory,
  selectedCity,
  selectedState,
  services,
  cities,
  states,
  onSearchChange,
  onServiceChange,
  onCategoryChange,
  onCityChange,
  onStateChange
}: ProfessionalsFiltersProps) => {
  const categories = [...new Set(services.map(s => s.category))];

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === "all" ? "" : value);
  };

  const handleServiceChange = (value: string) => {
    onServiceChange(value === "all" ? "" : value);
  };

  const handleCityChange = (value: string) => {
    onCityChange(value === "all" ? "" : value);
  };

  const handleStateChange = (value: string) => {
    onStateChange(value === "all" ? "" : value);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <Select value={selectedState || "all"} onValueChange={handleStateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={selectedCity || "all"} onValueChange={handleCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
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
