
-- Criar tabela para demandas de parcerias entre profissionais
CREATE TABLE public.partnership_demands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  service_id UUID NOT NULL REFERENCES public.services(id),
  required_skills TEXT,
  collaboration_type TEXT NOT NULL, -- 'complementary', 'joint', 'subcontract'
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  deadline DATE,
  location TEXT,
  status project_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para candidaturas a parcerias
CREATE TABLE public.partnership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partnership_demand_id UUID NOT NULL REFERENCES public.partnership_demands(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposal TEXT NOT NULL,
  proposed_price DECIMAL(10,2),
  estimated_duration TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(partnership_demand_id, professional_id)
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.partnership_demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_applications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para partnership_demands
CREATE POLICY "Profissionais podem gerenciar suas demandas de parceria" ON public.partnership_demands
  FOR ALL USING (auth.uid() = professional_id);

CREATE POLICY "Todos podem ver demandas de parceria abertas" ON public.partnership_demands
  FOR SELECT USING (status = 'open');

-- Políticas RLS para partnership_applications
CREATE POLICY "Profissionais podem gerenciar suas candidaturas de parceria" ON public.partnership_applications
  FOR ALL USING (auth.uid() = professional_id);

CREATE POLICY "Criadores de demandas podem ver candidaturas" ON public.partnership_applications
  FOR SELECT USING (auth.uid() IN (SELECT professional_id FROM public.partnership_demands WHERE id = partnership_demand_id));
