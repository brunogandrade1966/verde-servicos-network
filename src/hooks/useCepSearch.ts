
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const useCepSearch = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchCep = async (cep: string): Promise<CepData | null> => {
    if (!cep || cep.length < 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, digite um CEP válido com 8 dígitos.",
        variant: "destructive"
      });
      return null;
    }

    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, digite um CEP válido com 8 dígitos.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      console.log('Buscando CEP:', cleanCep);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro na busca do CEP');
      }

      const data: CepData = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "O CEP informado não foi encontrado.",
          variant: "destructive"
        });
        return null;
      }

      console.log('CEP encontrado:', data);
      toast({
        title: "CEP encontrado!",
        description: "Endereço preenchido automaticamente."
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar o CEP. Tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { searchCep, loading };
};
