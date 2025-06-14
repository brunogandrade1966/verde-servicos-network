
-- Criar enum para tipos de usuário
CREATE TYPE public.user_type AS ENUM ('client', 'professional', 'admin');

-- Criar enum para status de projetos
CREATE TYPE public.project_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'cancelled');

-- Criar enum para status de candidaturas
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected');

-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  user_type user_type NOT NULL DEFAULT 'client',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  document TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de serviços (catálogo de serviços ambientais)
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de especialidades dos profissionais
CREATE TABLE public.professional_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  experience_years INTEGER DEFAULT 0,
  price_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(professional_id, service_id)
);

-- Criar tabela de projetos/demandas
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  service_id UUID NOT NULL REFERENCES public.services(id),
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  deadline DATE,
  location TEXT,
  status project_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de candidaturas
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposal TEXT NOT NULL,
  proposed_price DECIMAL(10,2),
  estimated_duration TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, professional_id)
);

-- Criar tabela de parcerias entre profissionais
CREATE TABLE public.partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (professional1_id != professional2_id),
  UNIQUE(professional1_id, professional2_id)
);

-- Criar tabela de avaliações
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (reviewer_id != reviewed_id)
);

-- Inserir alguns serviços ambientais básicos
INSERT INTO public.services (name, description, category) VALUES
('Licenciamento Ambiental', 'Elaboração de estudos e documentos para licenciamento ambiental', 'Licenciamento'),
('Estudo de Impacto Ambiental (EIA)', 'Avaliação detalhada dos impactos ambientais de empreendimentos', 'Estudos'),
('Relatório de Impacto Ambiental (RIMA)', 'Documento síntese do EIA para consulta pública', 'Estudos'),
('Plano de Controle Ambiental (PCA)', 'Medidas preventivas e mitigadoras de impactos ambientais', 'Planejamento'),
('Monitoramento Ambiental', 'Acompanhamento de indicadores ambientais', 'Monitoramento'),
('Consultoria em Sustentabilidade', 'Orientação para práticas sustentáveis empresariais', 'Consultoria'),
('Educação Ambiental', 'Programas e treinamentos em educação ambiental', 'Educação'),
('Gestão de Resíduos', 'Planejamento e implementação de gestão de resíduos', 'Gestão'),
('Recuperação de Áreas Degradadas', 'Projetos de restauração ambiental', 'Recuperação'),
('Auditoria Ambiental', 'Avaliação de conformidade ambiental', 'Auditoria');

-- Habilitar RLS (Row Level Security) nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seus próprios perfis" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Todos podem ver perfis públicos" ON public.profiles
  FOR SELECT USING (true);

-- Políticas RLS para services (público para leitura)
CREATE POLICY "Todos podem ver serviços" ON public.services
  FOR SELECT USING (true);

-- Políticas RLS para professional_services
CREATE POLICY "Profissionais podem gerenciar seus serviços" ON public.professional_services
  FOR ALL USING (auth.uid() = professional_id);

CREATE POLICY "Todos podem ver serviços de profissionais" ON public.professional_services
  FOR SELECT USING (true);

-- Políticas RLS para projects
CREATE POLICY "Clientes podem gerenciar seus projetos" ON public.projects
  FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Todos podem ver projetos abertos" ON public.projects
  FOR SELECT USING (status IN ('open', 'in_progress'));

-- Políticas RLS para applications
CREATE POLICY "Profissionais podem gerenciar suas candidaturas" ON public.applications
  FOR ALL USING (auth.uid() = professional_id);

CREATE POLICY "Clientes podem ver candidaturas de seus projetos" ON public.applications
  FOR SELECT USING (auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id));

-- Políticas RLS para partnerships
CREATE POLICY "Profissionais podem gerenciar suas parcerias" ON public.partnerships
  FOR ALL USING (auth.uid() = professional1_id OR auth.uid() = professional2_id);

-- Políticas RLS para reviews
CREATE POLICY "Usuários podem ver avaliações" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem criar avaliações" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, name, email, phone, document)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'user_type', 'client')::user_type,
    COALESCE(new.raw_user_meta_data ->> 'name', ''),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'document'
  );
  RETURN new;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
