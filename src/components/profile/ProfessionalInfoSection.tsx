
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Plus, X } from 'lucide-react';

interface ProfessionalInfoSectionProps {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
  onArrayFieldChange: (field: string, action: 'add' | 'remove', value: string) => void;
}

const ProfessionalInfoSection = ({ formData, onInputChange, onArrayFieldChange }: ProfessionalInfoSectionProps) => {
  const [newSkill, setNewSkill] = useState('');

  const academicTitles = [
    'Graduação',
    'Especialização',
    'MBA',
    'Mestrado',
    'Doutorado',
    'Pós-Doutorado'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5" />
          <span>Informações Profissionais</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="academic_title">Título Acadêmico *</Label>
            <Select 
              value={formData.academic_title || ''} 
              onValueChange={(value) => onInputChange('academic_title', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu título acadêmico" />
              </SelectTrigger>
              <SelectContent>
                {academicTitles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="area_of_expertise">Área de Atuação *</Label>
            <Input
              id="area_of_expertise"
              value={formData.area_of_expertise || ''}
              onChange={(e) => onInputChange('area_of_expertise', e.target.value)}
              placeholder="Ex: Engenharia Ambiental"
              required
            />
          </div>
        </div>

        {/* Habilidades e Competências */}
        <div>
          <Label>Habilidades e Competências *</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Ex: Licenciamento Ambiental"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onArrayFieldChange('skills', 'add', newSkill);
                  setNewSkill('');
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onArrayFieldChange('skills', 'add', newSkill);
                setNewSkill('');
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills?.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => onArrayFieldChange('skills', 'remove', skill)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Formação Acadêmica */}
        <div>
          <Label htmlFor="education">Formação Acadêmica *</Label>
          <Textarea
            id="education"
            value={formData.education || ''}
            onChange={(e) => onInputChange('education', e.target.value)}
            placeholder="Ex: Engenharia Ambiental - USP (2020)"
            rows={3}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalInfoSection;
