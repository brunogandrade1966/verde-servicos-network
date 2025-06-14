
-- Primeiro, vamos garantir que o tipo user_type existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE public.user_type AS ENUM ('client', 'professional', 'admin');
    END IF;
END $$;

-- Recriar a função handle_new_user de forma mais simples e robusta
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
    user_type_val text;
BEGIN
    -- Extrair o user_type dos metadados
    user_type_val := COALESCE(new.raw_user_meta_data ->> 'user_type', 'client');
    
    -- Garantir que seja um valor válido
    IF user_type_val NOT IN ('client', 'professional', 'admin') THEN
        user_type_val := 'client';
    END IF;

    INSERT INTO public.profiles (id, user_type, name, email, phone, document)
    VALUES (
        new.id,
        user_type_val::public.user_type,
        COALESCE(new.raw_user_meta_data ->> 'name', 'Usuário'),
        new.email,
        new.raw_user_meta_data ->> 'phone',
        new.raw_user_meta_data ->> 'document'
    );
    
    RETURN new;
EXCEPTION WHEN OTHERS THEN
    -- Em caso de erro, inserir com valores mínimos
    INSERT INTO public.profiles (id, user_type, name, email)
    VALUES (
        new.id,
        'client'::public.user_type,
        COALESCE(new.raw_user_meta_data ->> 'name', 'Usuário'),
        new.email
    );
    RETURN new;
END;
$$;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
