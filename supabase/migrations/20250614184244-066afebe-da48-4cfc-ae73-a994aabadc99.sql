
-- Recriar a função handle_new_user com melhor tratamento de erros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, name, email, phone, document)
  VALUES (
    new.id,
    CASE 
      WHEN new.raw_user_meta_data ->> 'user_type' = 'professional' THEN 'professional'::user_type
      WHEN new.raw_user_meta_data ->> 'user_type' = 'admin' THEN 'admin'::user_type
      ELSE 'client'::user_type
    END,
    COALESCE(new.raw_user_meta_data ->> 'name', ''),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'document'
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log do erro para debug
  RAISE LOG 'Erro ao criar perfil do usuário %: %', new.id, SQLERRM;
  -- Inserir com valores padrão em caso de erro
  INSERT INTO public.profiles (id, user_type, name, email)
  VALUES (
    new.id,
    'client'::user_type,
    COALESCE(new.raw_user_meta_data ->> 'name', 'Usuário'),
    new.email
  );
  RETURN new;
END;
$$;
