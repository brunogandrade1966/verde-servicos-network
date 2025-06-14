
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_type: 'client' | 'professional' | 'admin';
  name: string;
  email: string;
  phone?: string;
  document?: string;
  avatar_url?: string;
  bio?: string;
  // Informações de Contato
  whatsapp?: string;
  // Links Profissionais
  website?: string;
  linkedin_url?: string;
  lattes_url?: string;
  // Informações Profissionais
  academic_title?: string;
  area_of_expertise?: string;
  skills?: string[];
  education?: string;
  // Registro Profissional
  professional_entity?: string;
  registration_number?: string;
  // Endereço
  postal_code?: string;
  address?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  // Campos específicos do cliente
  company_name?: string;
  company_size?: string;
  industry?: string;
  // Campos específicos do profissional
  experience_years?: number;
  specializations?: string[];
  certifications?: string[];
  languages?: string[];
  portfolio_url?: string;
  availability?: string;
  hourly_rate?: number;
}

export const useAuthActions = (user: User | null, fetchUserProfile: (userId: string) => Promise<void>) => {
  const { toast } = useToast();

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Signing up user:', email, userData);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta."
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Signup exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Signin error:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Signin exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Signout error:', error);
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      console.log('Updating profile:', updates);
      
      // Converter arrays para JSON strings antes de salvar
      const dataToUpdate = {
        ...updates,
        skills: updates.skills ? JSON.stringify(updates.skills) : undefined,
        specializations: updates.specializations ? JSON.stringify(updates.specializations) : undefined,
        certifications: updates.certifications ? JSON.stringify(updates.certifications) : undefined,
        languages: updates.languages ? JSON.stringify(updates.languages) : undefined
      };

      // Remover campos undefined
      Object.keys(dataToUpdate).forEach(key => 
        dataToUpdate[key as keyof typeof dataToUpdate] === undefined && 
        delete dataToUpdate[key as keyof typeof dataToUpdate]
      );

      const { error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive"
        });
      } else {
        await fetchUserProfile(user.id);
        toast({
          title: "Perfil atualizado!",
          description: "Suas informações foram salvas com sucesso."
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Update profile exception:', error);
      return { error };
    }
  };

  return { signUp, signIn, signOut, updateProfile };
};
