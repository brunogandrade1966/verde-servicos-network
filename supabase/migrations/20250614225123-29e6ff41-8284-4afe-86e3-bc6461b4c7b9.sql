
-- Adicionar constraint única para evitar candidaturas duplicadas
ALTER TABLE public.applications 
ADD CONSTRAINT unique_application_per_project_professional 
UNIQUE (project_id, professional_id);

-- Adicionar constraint única para candidaturas de parceria
ALTER TABLE public.partnership_applications 
ADD CONSTRAINT unique_partnership_application_per_demand_professional 
UNIQUE (partnership_demand_id, professional_id);

-- Criar função para atualizar status do projeto quando candidatura é aceita
CREATE OR REPLACE FUNCTION public.update_project_status_on_accept()
RETURNS TRIGGER AS $$
BEGIN
  -- Se a candidatura foi aceita
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    -- Atualizar status do projeto para 'in_progress'
    UPDATE public.projects 
    SET status = 'in_progress', updated_at = now()
    WHERE id = NEW.project_id;
    
    -- Rejeitar todas as outras candidaturas pendentes para este projeto
    UPDATE public.applications 
    SET status = 'rejected', updated_at = now()
    WHERE project_id = NEW.project_id 
    AND id != NEW.id 
    AND status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar função para atualizar status da demanda de parceria quando candidatura é aceita
CREATE OR REPLACE FUNCTION public.update_partnership_status_on_accept()
RETURNS TRIGGER AS $$
BEGIN
  -- Se a candidatura foi aceita
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    -- Atualizar status da demanda de parceria para 'in_progress'
    UPDATE public.partnership_demands 
    SET status = 'in_progress', updated_at = now()
    WHERE id = NEW.partnership_demand_id;
    
    -- Rejeitar todas as outras candidaturas pendentes para esta demanda de parceria
    UPDATE public.partnership_applications 
    SET status = 'rejected', updated_at = now()
    WHERE partnership_demand_id = NEW.partnership_demand_id 
    AND id != NEW.id 
    AND status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para executar as funções
CREATE TRIGGER trigger_update_project_status_on_accept
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_project_status_on_accept();

CREATE TRIGGER trigger_update_partnership_status_on_accept
  AFTER UPDATE ON public.partnership_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_partnership_status_on_accept();

-- Habilitar RLS nas tabelas de candidaturas se ainda não estiver habilitado
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_applications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para applications
DROP POLICY IF EXISTS "Profissionais podem ver suas candidaturas" ON public.applications;
DROP POLICY IF EXISTS "Clientes podem ver candidaturas de seus projetos" ON public.applications;
DROP POLICY IF EXISTS "Profissionais podem criar candidaturas" ON public.applications;
DROP POLICY IF EXISTS "Profissionais podem atualizar suas candidaturas" ON public.applications;
DROP POLICY IF EXISTS "Clientes podem atualizar candidaturas de seus projetos" ON public.applications;

CREATE POLICY "Profissionais podem ver suas candidaturas" ON public.applications
  FOR SELECT USING (auth.uid() = professional_id);

CREATE POLICY "Clientes podem ver candidaturas de seus projetos" ON public.applications
  FOR SELECT USING (auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Profissionais podem criar candidaturas" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Profissionais podem atualizar suas candidaturas" ON public.applications
  FOR UPDATE USING (auth.uid() = professional_id);

CREATE POLICY "Clientes podem atualizar candidaturas de seus projetos" ON public.applications
  FOR UPDATE USING (auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id));

-- Políticas RLS para partnership_applications
DROP POLICY IF EXISTS "Profissionais podem ver suas candidaturas de parceria" ON public.partnership_applications;
DROP POLICY IF EXISTS "Criadores podem ver candidaturas de suas demandas" ON public.partnership_applications;
DROP POLICY IF EXISTS "Profissionais podem criar candidaturas de parceria" ON public.partnership_applications;
DROP POLICY IF EXISTS "Profissionais podem atualizar suas candidaturas de parceria" ON public.partnership_applications;
DROP POLICY IF EXISTS "Criadores podem atualizar candidaturas de suas demandas" ON public.partnership_applications;

CREATE POLICY "Profissionais podem ver suas candidaturas de parceria" ON public.partnership_applications
  FOR SELECT USING (auth.uid() = professional_id);

CREATE POLICY "Criadores podem ver candidaturas de suas demandas" ON public.partnership_applications
  FOR SELECT USING (auth.uid() IN (SELECT professional_id FROM public.partnership_demands WHERE id = partnership_demand_id));

CREATE POLICY "Profissionais podem criar candidaturas de parceria" ON public.partnership_applications
  FOR INSERT WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Profissionais podem atualizar suas candidaturas de parceria" ON public.partnership_applications
  FOR UPDATE USING (auth.uid() = professional_id);

CREATE POLICY "Criadores podem atualizar candidaturas de suas demandas" ON public.partnership_applications
  FOR UPDATE USING (auth.uid() IN (SELECT professional_id FROM public.partnership_demands WHERE id = partnership_demand_id));
