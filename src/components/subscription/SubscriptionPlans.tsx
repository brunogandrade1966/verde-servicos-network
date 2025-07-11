import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";

const plans = {
  client: [
    {
      id: 'cliente_pf',
      name: 'Cliente Pessoa Física',
      price: 'R$ 29,99',
      period: '/mês',
      description: 'Para pessoas físicas que precisam de serviços ambientais',
      features: [
        'Criar demandas ilimitadas',
        'Visualizar candidaturas recebidas',
        'Chat com profissionais',
        'Relatórios básicos'
      ]
    },
    {
      id: 'cliente_pj',
      name: 'Cliente Pessoa Jurídica',
      price: 'R$ 99,99',
      period: '/mês',
      description: 'Para empresas que necessitam de serviços ambientais',
      features: [
        'Criar demandas ilimitadas',
        'Visualizar candidaturas recebidas',
        'Chat com profissionais',
        'Relatórios avançados',
        'Suporte prioritário',
        'Múltiplos projetos'
      ]
    }
  ],
  professional: [
    {
      id: 'profissional_basico',
      name: 'Profissional Básico',
      price: 'R$ 49,99',
      period: '/mês',
      description: 'Para profissionais iniciantes',
      features: [
        'Até 5 candidaturas por mês',
        'Visualizar demandas disponíveis',
        'Chat com clientes',
        'Criar solicitações de parceria',
        'Relatórios básicos'
      ]
    },
    {
      id: 'profissional_premium',
      name: 'Profissional Premium',
      price: 'R$ 99,99',
      period: '/mês',
      description: 'Para profissionais estabelecidos',
      features: [
        'Até 15 candidaturas por mês',
        'Visualizar demandas disponíveis',
        'Chat com clientes',
        'Criar solicitações de parceria',
        'Relatórios avançados',
        'Destaque no perfil'
      ]
    },
    {
      id: 'profissional_enterprise',
      name: 'Profissional Enterprise',
      price: 'R$ 199,99',
      period: '/mês',
      description: 'Para profissionais de alto volume',
      features: [
        'Candidaturas ilimitadas',
        'Visualizar demandas disponíveis',
        'Chat com clientes',
        'Criar solicitações de parceria',
        'Relatórios completos',
        'Destaque premium',
        'Suporte prioritário'
      ]
    }
  ]
};

export const SubscriptionPlans = () => {
  const { profile } = useAuth();
  const { subscription, createCheckout, loading } = useSubscription();
  
  const userType = profile?.user_type;
  const currentPlans = userType === 'client' ? plans.client : plans.professional;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Escolha seu Plano</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {userType === 'client' 
            ? 'Selecione o plano ideal para suas necessidades de contratação de serviços ambientais'
            : 'Escolha o plano que melhor se adequa ao seu perfil profissional'
          }
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {currentPlans.map((plan) => {
          const isCurrentPlan = subscription.subscription_tier === plan.id;
          
          return (
            <Card key={plan.id} className={`relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
              {isCurrentPlan && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Plano Atual
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => createCheckout(plan.id)}
                  disabled={loading || isCurrentPlan}
                  variant={isCurrentPlan ? "secondary" : "default"}
                >
                  {loading ? 'Processando...' : 
                   isCurrentPlan ? 'Plano Atual' : 'Assinar Agora'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};