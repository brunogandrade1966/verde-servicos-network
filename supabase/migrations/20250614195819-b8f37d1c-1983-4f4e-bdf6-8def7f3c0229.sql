
-- Adicionar campos específicos para profissionais que estão faltando na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS lattes_url text,
ADD COLUMN IF NOT EXISTS academic_title text,
ADD COLUMN IF NOT EXISTS area_of_expertise text,
ADD COLUMN IF NOT EXISTS skills text,
ADD COLUMN IF NOT EXISTS professional_entity text,
ADD COLUMN IF NOT EXISTS registration_number text,
ADD COLUMN IF NOT EXISTS address_number text,
ADD COLUMN IF NOT EXISTS address_complement text,
ADD COLUMN IF NOT EXISTS neighborhood text;
