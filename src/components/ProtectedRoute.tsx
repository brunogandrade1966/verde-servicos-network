
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading, session } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - loading:', loading, 'user:', user, 'session:', session, 'requireAuth:', requireAuth, 'path:', location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Para rotas que requerem autenticação
  if (requireAuth && !user) {
    console.log('Redirecting to login - no user and auth required');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Para rotas que NÃO requerem autenticação (login, register, home)
  // Só redirecionar se estiver nas páginas de login/register e o usuário estiver autenticado
  if (!requireAuth && user && session && (location.pathname === '/login' || location.pathname === '/register')) {
    console.log('Redirecting to dashboard - user exists and trying to access login/register');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
