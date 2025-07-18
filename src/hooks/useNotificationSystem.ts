import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanLimitations } from './usePlanLimitations';

interface NotificationPreference {
  id?: string;
  professional_id: string;
  service_ids: string[];
  locations: string[];
  email_notifications: boolean;
  whatsapp_notifications: boolean;
  notification_delay: number;
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
      // Simplified approach - use local storage for now
      const stored = localStorage.getItem(`notification_prefs_${profile.id}`);
      if (stored) {
        setPreferences(JSON.parse(stored));
      } else {
        // Set default preferences
        const defaultPrefs: NotificationPreference = {
          professional_id: profile.id,
          service_ids: [],
          locations: [],
          email_notifications: true,
          whatsapp_notifications: false,
          notification_delay: 0
        };
        setPreferences(defaultPrefs);
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreference>) => {
    if (!profile) return { success: false };

    setLoading(true);
    try {
      const updated = {
        ...preferences,
        ...newPreferences,
        professional_id: profile.id
      } as NotificationPreference;

      // Save to local storage for now
      localStorage.setItem(`notification_prefs_${profile.id}`, JSON.stringify(updated));
      setPreferences(updated);
      
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