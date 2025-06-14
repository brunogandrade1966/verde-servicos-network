
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Calendar, MapPin } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface FormData {
  title: string;
  description: string;
  service_id: string;
  budget_min: string;
  budget_max: string;
  deadline: string;
  location: string;
  status: string;
}

interface ProjectFormFieldsProps {
  formData: FormData;
  services: Service[];
  onInputChange: (field: string, value: string) => void;
}

export const ProjectFormFields = ({ formData, services, onInputChange }: ProjectFormFieldsProps) => {
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <>
      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="title">Título do Projeto *</Label>
        <Input
          id="title"
          placeholder="Ex: Licenciamento ambiental para construção de galpão industrial"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
        />
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição Detalhada *</Label>
        <Textarea
          id="description"
          placeholder="Descreva em detalhes o que você precisa, incluindo localização, prazo, requisitos específicos..."
          rows={4}
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
        />
      </div>

      {/* Tipo de Serviço */}
      <div className="space-y-2">
        <Label htmlFor="service">Tipo de Serviço *</Label>
        <Select onValueChange={(value) => onInputChange('service_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de serviço ambiental" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category}>
                <div className="px-2 py-1 text-sm font-medium text-gray-500 bg-gray-50">
                  {category}
                </div>
                {categoryServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orçamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget_min">Orçamento Mínimo (R$)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="budget_min"
              type="number"
              placeholder="0,00"
              className="pl-10"
              value={formData.budget_min}
              onChange={(e) => onInputChange('budget_min', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget_max">Orçamento Máximo (R$)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="budget_max"
              type="number"
              placeholder="0,00"
              className="pl-10"
              value={formData.budget_max}
              onChange={(e) => onInputChange('budget_max', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Prazo e Localização */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deadline">Prazo Desejado</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="deadline"
              type="date"
              className="pl-10"
              value={formData.deadline}
              onChange={(e) => onInputChange('deadline', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="location"
              placeholder="Cidade, Estado"
              className="pl-10"
              value={formData.location}
              onChange={(e) => onInputChange('location', e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
