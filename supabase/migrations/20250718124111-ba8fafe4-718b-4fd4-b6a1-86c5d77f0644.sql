-- Create notification_preferences table for professional alert settings
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_ids TEXT[] DEFAULT '{}',
  locations TEXT[] DEFAULT '{}',
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  whatsapp_notifications BOOLEAN NOT NULL DEFAULT false,
  notification_delay INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(professional_id)
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Professionals can manage their own notification preferences
CREATE POLICY "professionals_own_preferences" ON public.notification_preferences
FOR ALL
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_preferences_updated_at();