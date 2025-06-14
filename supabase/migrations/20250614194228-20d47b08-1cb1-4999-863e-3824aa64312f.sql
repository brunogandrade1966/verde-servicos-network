
-- Adicionar campos específicos para profissionais e clientes à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN company_name text,
ADD COLUMN company_size text,
ADD COLUMN industry text,
ADD COLUMN address text,
ADD COLUMN city text,
ADD COLUMN state text,
ADD COLUMN postal_code text,
ADD COLUMN education text,
ADD COLUMN experience_years integer,
ADD COLUMN specializations text,
ADD COLUMN certifications text,
ADD COLUMN languages text,
ADD COLUMN linkedin_url text,
ADD COLUMN portfolio_url text,
ADD COLUMN availability text,
ADD COLUMN hourly_rate numeric;
