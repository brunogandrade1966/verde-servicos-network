
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalProfileForm from '@/components/profile/ProfessionalProfileForm';
import ClientProfileForm from '@/components/profile/ClientProfileForm';

const ProfessionalProfile = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar perfil do usuário.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
                <p className="text-sm text-gray-500">
                  {profile.user_type === 'professional' 
                    ? 'Gerencie suas informações profissionais'
                    : 'Gerencie suas informações pessoais'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>
    </div>
  );
};

export default ProfessionalProfile;
