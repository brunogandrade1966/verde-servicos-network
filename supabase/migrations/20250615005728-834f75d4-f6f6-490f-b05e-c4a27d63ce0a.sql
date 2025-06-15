
-- Habilitar RLS na tabela services se ainda não estiver habilitado
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Criar política que permite que admins leiam todos os serviços
CREATE POLICY "Admins can view all services" 
  ON public.services 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Criar política que permite que admins insiram serviços
CREATE POLICY "Admins can insert services" 
  ON public.services 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Criar política que permite que admins atualizem serviços
CREATE POLICY "Admins can update services" 
  ON public.services 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Criar política que permite que usuários em geral vejam serviços (para funcionalidade normal do app)
CREATE POLICY "Users can view services" 
  ON public.services 
  FOR SELECT 
  USING (true);
