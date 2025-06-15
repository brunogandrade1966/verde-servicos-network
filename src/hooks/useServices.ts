
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        toast({
          title: "Erro ao carregar serviços",
          description: error.message,
          variant: "destructive"
        });
        setServices([]);
      } else {
        console.log('Services fetched successfully:', data);
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error in fetchServices:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, refetch: fetchServices };
};
