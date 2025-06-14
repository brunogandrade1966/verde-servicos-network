
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useAuthActions } from '@/hooks/useAuthActions';

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

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading } = useAuthSession();
  const { profile, fetchUserProfile } = useAuthProfile(user);
  const { signUp, signIn, signOut, updateProfile } = useAuthActions(user, fetchUserProfile);

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
