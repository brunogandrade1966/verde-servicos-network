import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanLimitations } from './usePlanLimitations';

interface NotificationPreference {
  id: string;
  professional_id: string;
  service_ids: string[];
  locations: string[];
  email_notifications: boolean;
  whatsapp_notifications: boolean;
  notification_delay: number; // em minutos
}

export const useNotificationSystem = () => {
  const { profile } = useAuth();
  const { limitations } = usePlanLimitations();
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.user_type === 'professional') {
      loadPreferences();
    }
  }, [profile]);

  const loadPreferences = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('professional_id', profile.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found
        console.error('Error loading preferences:', error);
        return;
      }

      setPreferences(data);
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreference>) => {
    if (!profile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          professional_id: profile.id,
          ...newPreferences
        }, { onConflict: 'professional_id' })
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      return { success: true };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const getNotificationDelay = () => {
    // Plano gratuito tem delay de notificações
    if (!limitations.whatsapp) {
      return 60; // 1 hora de delay para plano gratuito
    }
    return 0; // Notificações instantâneas para planos pagos
  };

  const canReceiveWhatsApp = () => {
    return limitations.whatsapp || false;
  };

  const canReceiveEmail = () => {
    return true; // Todos os planos recebem email
  };

  return {
    preferences,
    loading,
    updatePreferences,
    getNotificationDelay,
    canReceiveWhatsApp,
    canReceiveEmail
  };
};