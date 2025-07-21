
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para o painel administrativo completo
    if (profile?.user_type === 'admin') {
      navigate('/admin');
    }
  }, [profile, navigate]);

  return null; // Component de transição apenas
};

export default AdminDashboard;
