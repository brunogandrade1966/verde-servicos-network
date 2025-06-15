
-- Primeiro, vamos identificar quais serviços têm duplicatas e suas referências
WITH service_duplicates AS (
  SELECT name, category, 
         array_agg(id ORDER BY created_at ASC) as service_ids,
         (array_agg(id ORDER BY created_at ASC))[1] as keep_id
  FROM public.services
  GROUP BY name, category
  HAVING COUNT(*) > 1
),
services_to_merge AS (
  SELECT 
    keep_id,
    unnest(service_ids[2:array_length(service_ids, 1)]) as duplicate_id
  FROM service_duplicates
)
-- Atualizar as referências nos projetos para apontar para o serviço mais antigo
UPDATE public.projects 
SET service_id = stm.keep_id
FROM services_to_merge stm
WHERE projects.service_id = stm.duplicate_id;

-- Atualizar as referências nas demandas de parceria
WITH service_duplicates AS (
  SELECT name, category, 
         array_agg(id ORDER BY created_at ASC) as service_ids,
         (array_agg(id ORDER BY created_at ASC))[1] as keep_id
  FROM public.services
  GROUP BY name, category
  HAVING COUNT(*) > 1
),
services_to_merge AS (
  SELECT 
    keep_id,
    unnest(service_ids[2:array_length(service_ids, 1)]) as duplicate_id
  FROM service_duplicates
)
UPDATE public.partnership_demands 
SET service_id = stm.keep_id
FROM services_to_merge stm
WHERE partnership_demands.service_id = stm.duplicate_id;

-- Atualizar as referências nos serviços profissionais
WITH service_duplicates AS (
  SELECT name, category, 
         array_agg(id ORDER BY created_at ASC) as service_ids,
         (array_agg(id ORDER BY created_at ASC))[1] as keep_id
  FROM public.services
  GROUP BY name, category
  HAVING COUNT(*) > 1
),
services_to_merge AS (
  SELECT 
    keep_id,
    unnest(service_ids[2:array_length(service_ids, 1)]) as duplicate_id
  FROM service_duplicates
)
UPDATE public.professional_services 
SET service_id = stm.keep_id
FROM services_to_merge stm
WHERE professional_services.service_id = stm.duplicate_id;

-- Agora remover os serviços duplicados (mantendo apenas o mais antigo)
WITH service_duplicates AS (
  SELECT name, category, 
         array_agg(id ORDER BY created_at ASC) as service_ids
  FROM public.services
  GROUP BY name, category
  HAVING COUNT(*) > 1
)
DELETE FROM public.services
WHERE id IN (
  SELECT unnest(service_ids[2:array_length(service_ids, 1)])
  FROM service_duplicates
);

-- Criar um índice único para prevenir duplicatas futuras
CREATE UNIQUE INDEX IF NOT EXISTS idx_services_unique_name_category 
ON public.services (name, category);
