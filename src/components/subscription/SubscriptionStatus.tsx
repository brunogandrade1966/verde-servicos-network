import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, RefreshCw } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const SubscriptionStatus = () => {
  const { subscription, loading, checkSubscription, openCustomerPortal } = useSubscription();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Status da Assinatura
            </CardTitle>
            <CardDescription>
              Gerencie sua assinatura e método de pagamento
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkSubscription}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={subscription.subscribed ? "default" : "secondary"}>
            {subscription.subscribed ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        {subscription.subscription_tier && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Plano:</span>
            <span className="text-sm">{subscription.subscription_tier}</span>
          </div>
        )}

        {subscription.subscription_end && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Próxima cobrança:</span>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              {formatDate(subscription.subscription_end)}
            </div>
          </div>
        )}

        {subscription.subscribed && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={openCustomerPortal}
            disabled={loading}
          >
            Gerenciar Assinatura
          </Button>
        )}

        {!subscription.subscribed && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-amber-800">
              ⚠️ Você precisa ter um plano de acesso ativo para visualizar detalhes completos e realizar ações na plataforma.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};