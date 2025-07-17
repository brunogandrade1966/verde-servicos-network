import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";

const plans = {
  client: [
    {
      id: 'plano_basico',
      name: 'Plano Básico',
      price: 'Gratuito',
      period: '',
      description: 'Crie demandas e receba candidaturas',
      features: [
        'Criar demandas ilimitadas',
        'Visualizar número de candidaturas',
        'Publicação básica'
      ],
      isGratuito: true
    },
    {
      id: 'acesso_total_unico',
      name: 'Acesso Total (Por Demanda)',
      price: 'R$ 79,00',
      period: '/demanda',
      description: 'Pagamento único por demanda criada',
      features: [
        'Tudo do Plano Básico',
        'Ver detalhes completos das candidaturas',
        'Sistema de mensagens diretas',
        'Avaliar profissionais',
        'Suporte dedicado'
      ]
    },
    {
      id: 'acesso_total_mensal',
      name: 'Acesso Total (Mensal)',
      price: 'R$ 199,00',
      period: '/mês',
      description: 'Acesso total por assinatura mensal',
      features: [
        'Tudo do Plano Básico',
        'Ver detalhes completos das candidaturas',
        'Sistema de mensagens diretas',
        'Avaliar profissionais',
        'Demandas ilimitadas com acesso total',
        'Relatórios avançados',
        'Suporte prioritário'
      ]
    }
  ],
  professional: [
    {
      id: 'plano_semente',
      name: 'Plano Semente',
      price: 'Gratuito',
      period: '',
      description: 'Crie seu perfil e explore oportunidades',
      features: [
        '1 serviço no perfil',
        'Visualizar demandas',
        'Receber notificações por email (com delay)',
        'Perfil básico'
      ],
      limitations: {
        services: 1,
        applications: 0,
        messages: false,
        whatsapp: false
      },
      isGratuito: true
    },
    {
      id: 'plano_raiz',
      name: 'Plano Raiz',
      price: 'R$ 49,00',
      period: '/mês',
      description: 'Para profissionais que estão começando',
      features: [
        '5 serviços no perfil',
        '15 candidaturas por mês',
        'Sistema de mensagens diretas',
        'Notificações por email instantâneas',
        'Busca ativa de oportunidades'
      ],
      limitations: {
        services: 5,
        applications: 15,
        messages: true,
        whatsapp: false
      }
    },
    {
      id: 'plano_copa',
      name: 'Plano Copa',
      price: 'R$ 89,00',
      period: '/mês',
      description: 'Para profissionais estabelecidos',
      features: [
        '15 serviços no perfil',
        '50 candidaturas por mês',
        'Sistema de mensagens diretas',
        'Notificações por email instantâneas',
        'Notificações via WhatsApp',
        'Destaque no perfil'
      ],
      limitations: {
        services: 15,
        applications: 50,
        messages: true,
        whatsapp: true
      }
    },
    {
      id: 'plano_ecossistema',
      name: 'Plano Ecossistema',
      price: 'R$ 129,00',
      period: '/mês',
      description: 'Para profissionais de alto volume',
      features: [
        'Serviços ilimitados no perfil',
        'Candidaturas ilimitadas',
        'Sistema de mensagens diretas',
        'Notificações por email instantâneas',
        'Notificações via WhatsApp',
        'Destaque premium no perfil',
        'Relatórios completos',
        'Suporte prioritário'
      ],
      limitations: {
        services: 999,
        applications: 999,
        messages: true,
        whatsapp: true
      }
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