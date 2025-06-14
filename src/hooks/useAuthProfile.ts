
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
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (user) {
      // Use setTimeout to defer the profile fetch and avoid potential recursion
      setTimeout(() => {
        fetchUserProfile(user.id);
      }, 0);
    } else {
      setProfile(null);
    }
  }, [user]);

  return { profile, fetchUserProfile };
};
