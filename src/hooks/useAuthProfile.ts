
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
  // Campos específicos do cliente
  company_name?: string;
  company_size?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  // Campos específicos do profissional
  education?: string;
  experience_years?: number;
  specializations?: string[];
  certifications?: string[];
  languages?: string[];
  linkedin_url?: string;
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
