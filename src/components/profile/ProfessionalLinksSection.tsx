
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';

interface ProfessionalLinksSectionProps {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
}

const ProfessionalLinksSection = ({ formData, onInputChange }: ProfessionalLinksSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Link className="h-5 w-5" />
          <span>Links Profissionais</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website || ''}
              onChange={(e) => onInputChange('website', e.target.value)}
              placeholder="https://seu-website.com"
            />
          </div>
          <div>
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url || ''}
              onChange={(e) => onInputChange('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/seu-perfil"
            />
          </div>
          <div>
            <Label htmlFor="lattes_url">Currículo Lattes</Label>
            <Input
              id="lattes_url"
              value={formData.lattes_url || ''}
              onChange={(e) => onInputChange('lattes_url', e.target.value)}
              placeholder="http://lattes.cnpq.br/..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalLinksSection;
