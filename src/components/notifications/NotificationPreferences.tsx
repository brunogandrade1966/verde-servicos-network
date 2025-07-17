import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageCircle } from 'lucide-react';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { useServices } from '@/hooks/useServices';
import { toast } from 'sonner';

export const NotificationPreferences = () => {
  const { preferences, loading, updatePreferences, canReceiveWhatsApp, canReceiveEmail } = useNotificationSystem();
  const { services } = useServices();
  const [formData, setFormData] = useState({
    service_ids: [] as string[],
    locations: [] as string[],
    email_notifications: true,
    whatsapp_notifications: false
  });

  useEffect(() => {
    if (preferences) {
      setFormData({
        service_ids: preferences.service_ids || [],
        locations: preferences.locations || [],
        email_notifications: preferences.email_notifications ?? true,
        whatsapp_notifications: preferences.whatsapp_notifications ?? false
      });
    }
  }, [preferences]);

  const handleSave = async () => {
    const result = await updatePreferences(formData);
    if (result?.success) {
      toast.success('Preferências de notificação atualizadas!');
    } else {
      toast.error('Erro ao atualizar preferências');
    }
  };

  const serviceOptions = services.map(service => ({
    value: service.id,
    label: service.name
  }));

  const locationOptions = [
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'PR', label: 'Paraná' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'BA', label: 'Bahia' },
    { value: 'GO', label: 'Goiás' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'CE', label: 'Ceará' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Preferências de Notificação
        </CardTitle>
        <CardDescription>
          Configure como e quando você quer ser notificado sobre novas oportunidades
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canais de Notificação */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Canais de Notificação</h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Label htmlFor="email-notifications">Notificações por E-mail</Label>
              {!canReceiveEmail() && (
                <Badge variant="secondary">Upgrade necessário</Badge>
              )}
            </div>
            <Switch
              id="email-notifications"
              checked={formData.email_notifications && canReceiveEmail()}
              onCheckedChange={(checked) => setFormData({...formData, email_notifications: checked})}
              disabled={!canReceiveEmail()}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <Label htmlFor="whatsapp-notifications">Notificações via WhatsApp</Label>
              {!canReceiveWhatsApp() && (
                <Badge variant="secondary">Upgrade necessário</Badge>
              )}
            </div>
            <Switch
              id="whatsapp-notifications"
              checked={formData.whatsapp_notifications && canReceiveWhatsApp()}
              onCheckedChange={(checked) => setFormData({...formData, whatsapp_notifications: checked})}
              disabled={!canReceiveWhatsApp()}
            />
          </div>
        </div>

        {/* Filtros de Conteúdo */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Tipos de Serviço</h4>
          <MultiSelect
            options={serviceOptions}
            value={formData.service_ids}
            onChange={(value) => setFormData({...formData, service_ids: value})}
            placeholder="Selecione os serviços de interesse"
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Localização</h4>
          <MultiSelect
            options={locationOptions}
            value={formData.locations}
            onChange={(value) => setFormData({...formData, locations: value})}
            placeholder="Selecione os estados de interesse"
          />
        </div>

        {/* Informações do Plano */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Informações do seu Plano</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>E-mail:</span>
              <Badge variant={canReceiveEmail() ? "default" : "secondary"}>
                {canReceiveEmail() ? "Disponível" : "Indisponível"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>WhatsApp:</span>
              <Badge variant={canReceiveWhatsApp() ? "default" : "secondary"}>
                {canReceiveWhatsApp() ? "Disponível" : "Upgrade necessário"}
              </Badge>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Preferências'}
        </Button>
      </CardContent>
    </Card>
  );
};