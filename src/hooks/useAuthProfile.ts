
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

export const useAuthProfile = (user: User | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile fetched:', data);
      
      // Parse campos JSON se existirem e não forem null
      const profileData = {
        ...data,
        skills: data.skills ? JSON.parse(data.skills) : [],
        specializations: data.specializations ? JSON.parse(data.specializations) : [],
        certifications: data.certifications ? JSON.parse(data.certifications) : [],
        languages: data.languages ? JSON.parse(data.languages) : []
      };
      
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        fetchUserProfile(user.id);
      }, 0);
    } else {
      setProfile(null);
    }
  }, [user]);

  return { profile, fetchUserProfile };
};
