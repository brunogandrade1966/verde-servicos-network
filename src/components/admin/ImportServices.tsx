
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface ServiceData {
  id: string;
  name: string;
  description: string;
  categoryid: string;
  created_at: string;
}

const ImportServices = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const { toast } = useToast();

  const parseCSV = (text: string): ServiceData[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const service: any = {};
      
      headers.forEach((header, index) => {
        service[header] = values[index] || '';
      });
      
      return service as ServiceData;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
    }
  };

  const processServices = async () => {
    if (!file) return;

    setLoading(true);
    setProgress('Lendo arquivo...');

    try {
      const text = await file.text();
      const services = parseCSV(text);
      
      setProgress(`Processando ${services.length} serviços...`);

      // Mapear categoryid para category names
      const categoryMap: { [key: string]: string } = {
        '1': 'Licenciamento Ambiental',
        '2': 'Consultoria Ambiental',
        '3': 'Gestão de Resíduos',
        '4': 'Monitoramento Ambiental',
        '5': 'Educação Ambiental',
        '6': 'Recuperação de Áreas',
        '7': 'Auditoria Ambiental',
        '8': 'Estudos Ambientais'
      };

      let successCount = 0;
      let errorCount = 0;

      for (const service of services) {
        try {
          const category = categoryMap[service.categoryid] || 'Outros';
          
          const { error } = await supabase
            .from('services')
            .insert({
              name: service.name,
              description: service.description,
              category: category
            });

          if (error) {
            console.error('Erro ao inserir serviço:', service.name, error);
            errorCount++;
          } else {
            successCount++;
          }
          
          setProgress(`Processando: ${successCount + errorCount}/${services.length}`);
        } catch (err) {
          console.error('Erro ao processar serviço:', service.name, err);
          errorCount++;
        }
      }

      setProgress('');
      
      toast({
        title: "Importação concluída!",
        description: `${successCount} serviços importados com sucesso. ${errorCount} erros.`,
        variant: successCount > 0 ? "default" : "destructive"
      });

    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: "Erro na importação",
        description: "Erro ao processar o arquivo CSV.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Importar Serviços Ambientais</span>
        </CardTitle>
        <CardDescription>
          Faça upload do arquivo CSV com os serviços ambientais predefinidos
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="csv-file">Arquivo CSV</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
          />
          <p className="text-sm text-gray-500">
            Formato esperado: id, name, description, categoryid, created_at
          </p>
        </div>

        {file && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
            <FileText className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">{file.name}</span>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        )}

        {progress && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">{progress}</span>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium">Mapeamento de Categorias:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>1 → Licenciamento Ambiental</p>
            <p>2 → Consultoria Ambiental</p>
            <p>3 → Gestão de Resíduos</p>
            <p>4 → Monitoramento Ambiental</p>
            <p>5 → Educação Ambiental</p>
            <p>6 → Recuperação de Áreas</p>
            <p>7 → Auditoria Ambiental</p>
            <p>8 → Estudos Ambientais</p>
          </div>
        </div>

        <Button 
          onClick={processServices}
          disabled={!file || loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Processando...' : 'Importar Serviços'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImportServices;
