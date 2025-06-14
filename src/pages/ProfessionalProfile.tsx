
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfessionalProfileForm from '@/components/profile/ProfessionalProfileForm';
import ClientProfileForm from '@/components/profile/ClientProfileForm';
import ClientLayout from '@/components/layout/ClientLayout';

const ProfessionalProfile = () => {
  const { profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar perfil do usuário.</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto">
        {profile.user_type === 'professional' ? (
          <ProfessionalProfileForm
            profile={profile}
            userId={profile.id}
            onSave={handleSave}
            loading={loading}
          />
        ) : (
          <ClientProfileForm
            profile={profile}
            userId={profile.id}
            onSave={handleSave}
            loading={loading}
          />
        )}
      </div>
    </ClientLayout>
  );
};

export default ProfessionalProfile;
