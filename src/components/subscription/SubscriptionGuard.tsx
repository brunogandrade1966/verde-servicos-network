import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const { hasActiveSubscription, loading } = useSubscription();
  const navigate = useNavigate();

  if (loading) {
    return <div>Verificando assinatura...</div>;
  }

  if (!hasActiveSubscription) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          ⚠️ Você precisa ter um plano de acesso ativo para visualizar esta informação ou realizar esta ação.
          <div className="mt-3">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate('/subscription')}
              className="border-amber-300 text-amber-800 hover:bg-amber-100"
            >
              Ver Planos
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};