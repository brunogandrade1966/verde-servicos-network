
-- Add partnership_demand_id column to conversations table to support partnership conversations
ALTER TABLE public.conversations 
ADD COLUMN partnership_demand_id UUID REFERENCES public.partnership_demands(id) ON DELETE SET NULL;

-- Update the conversations table to have replica identity for real-time updates
ALTER TABLE public.conversations REPLICA IDENTITY FULL;

-- Add the conversations table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
