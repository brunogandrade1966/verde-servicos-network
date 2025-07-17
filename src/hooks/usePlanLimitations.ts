import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from './useSubscription';

export const usePlanLimitations = () => {
  const { profile } = useAuth();
  const { subscription } = useSubscription();

  const getPlanLimitations = () => {
    const userType = profile?.user_type;
    const currentTier = subscription.subscription_tier;

    if (userType === 'professional') {
      switch (currentTier) {
        case 'plano_semente':
          return {
            services: 1,
            applications: 0,
            messages: false,
            whatsapp: false,
            canApply: false
          };
        case 'plano_raiz':
          return {
            services: 5,
            applications: 15,
            messages: true,
            whatsapp: false,
            canApply: true
          };
        case 'plano_copa':
          return {
            services: 15,
            applications: 50,
            messages: true,
            whatsapp: true,
            canApply: true
          };
        case 'plano_ecossistema':
          return {
            services: 999,
            applications: 999,
            messages: true,
            whatsapp: true,
            canApply: true
          };
        default:
          return {
            services: 1,
            applications: 0,
            messages: false,
            whatsapp: false,
            canApply: false
          };
      }
    } else if (userType === 'client') {
      switch (currentTier) {
        case 'plano_basico':
          return {
            canViewCandidateDetails: false,
            canAccessMessages: false,
            canEvaluate: false
          };
        case 'acesso_total_unico':
        case 'acesso_total_mensal':
          return {
            canViewCandidateDetails: true,
            canAccessMessages: true,
            canEvaluate: true
          };
        default:
          return {
            canViewCandidateDetails: false,
            canAccessMessages: false,
            canEvaluate: false
          };
      }
    }

    return {};
  };

  const canPerformAction = (action: string) => {
    const limits = getPlanLimitations();
    return limits[action] || false;
  };

  const hasReachedLimit = (currentUsage: number, limitType: string) => {
    const limits = getPlanLimitations();
    const limit = limits[limitType];
    return typeof limit === 'number' && currentUsage >= limit;
  };

  return {
    limitations: getPlanLimitations(),
    canPerformAction,
    hasReachedLimit,
    hasActiveSubscription: subscription.subscribed
  };
};