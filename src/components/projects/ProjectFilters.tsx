
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
}

interface ProjectFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedService: string;
  services: Service[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onServiceChange: (value: string) => void;
}

const ProjectFilters = ({
  searchTerm,
  selectedCategory,
  selectedService,
  services,
  onSearchChange,
  onCategoryChange,
  onServiceChange
}: ProjectFiltersProps) => {
  const categories = [...new Set(services.map(service => service.category))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar projetos</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Digite palavras-chave..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Serviço Específico</Label>
          <Select value={selectedService} onValueChange={onServiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os serviços" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os serviços</SelectItem>
              {services
                .filter(service => selectedCategory === 'all' || service.category === selectedCategory)
                .map((service) => (
                  <SelectItem key={service.id} value={service.id}>
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

export default ProjectFilters;
