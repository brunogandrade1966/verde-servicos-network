import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  user_type: 'client' | 'professional';
  limitations: Record<string, any>;
  active: boolean;
  stripe_product_id?: string | null;
  stripe_price_id?: string | null;
}

const defaultPlans: Plan[] = [
  // Client plans
  {
    id: 'plano_basico',
    name: 'Plano Básico',
    price: 0,
    period: '',
    description: 'Crie demandas e receba candidaturas',
    features: ['Criar demandas ilimitadas', 'Visualizar número de candidaturas', 'Publicação básica'],
    user_type: 'client',
    limitations: { canViewCandidateDetails: false, canAccessMessages: false, canEvaluate: false },
    active: true
  },
  {
    id: 'acesso_total_unico',
    name: 'Acesso Total (Por Demanda)',
    price: 79,
    period: '/demanda',
    description: 'Pagamento único por demanda criada',
    features: ['Tudo do Plano Básico', 'Ver detalhes completos das candidaturas', 'Sistema de mensagens diretas', 'Avaliar profissionais', 'Suporte dedicado'],
    user_type: 'client',
    limitations: {},
    active: true
  },
  {
    id: 'acesso_total_mensal',
    name: 'Acesso Total (Mensal)',
    price: 199,
    period: '/mês',
    description: 'Acesso total por assinatura mensal',
    features: ['Tudo do Plano Básico', 'Ver detalhes completos das candidaturas', 'Sistema de mensagens diretas', 'Avaliar profissionais', 'Demandas ilimitadas com acesso total', 'Relatórios avançados', 'Suporte prioritário'],
    user_type: 'client',
    limitations: {},
    active: true
  },
  
  // Professional plans
  {
    id: 'plano_semente',
    name: 'Plano Semente',
    price: 0,
    period: '',
    description: 'Crie seu perfil e explore oportunidades',
    features: ['1 serviço no perfil', 'Visualizar demandas', 'Receber notificações por email (com delay)', 'Perfil básico'],
    user_type: 'professional',
    limitations: { services: 1, applications: 0, messages: false, whatsapp: false },
    active: true
  },
  {
    id: 'plano_raiz',
    name: 'Plano Raiz',
    price: 49,
    period: '/mês',
    description: 'Para profissionais que estão começando',
    features: ['5 serviços no perfil', '15 candidaturas por mês', 'Sistema de mensagens diretas', 'Notificações por email instantâneas', 'Busca ativa de oportunidades'],
    user_type: 'professional',
    limitations: { services: 5, applications: 15, messages: true, whatsapp: false },
    active: true
  },
  {
    id: 'plano_copa',
    name: 'Plano Copa',
    price: 89,
    period: '/mês',
    description: 'Para profissionais estabelecidos',
    features: ['15 serviços no perfil', '50 candidaturas por mês', 'Sistema de mensagens diretas', 'Notificações por email instantâneas', 'Notificações via WhatsApp', 'Destaque no perfil'],
    user_type: 'professional',
    limitations: { services: 15, applications: 50, messages: true, whatsapp: true },
    active: true
  },
  {
    id: 'plano_ecossistema',
    name: 'Plano Ecossistema',
    price: 129,
    period: '/mês',
    description: 'Para profissionais de alto volume',
    features: ['Serviços ilimitados no perfil', 'Candidaturas ilimitadas', 'Sistema de mensagens diretas', 'Notificações por email instantâneas', 'Notificações via WhatsApp', 'Destaque premium no perfil', 'Relatórios completos', 'Suporte prioritário'],
    user_type: 'professional',
    limitations: { services: 999, applications: 999, messages: true, whatsapp: true },
    active: true
  }
];

export default function AdminPlans() {
  const { profile, session } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (profile?.user_type !== 'admin') {
      navigate('/dashboard');
      return;
    }
  }, [profile, navigate]);

  const handleSavePlan = (plan: Plan) => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === plan.id ? plan : p));
      toast.success('Plano atualizado com sucesso!');
    } else {
      setPlans([...plans, { ...plan, id: `plan_${Date.now()}` }]);
      toast.success('Plano criado com sucesso!');
    }
    
    setEditingPlan(null);
    setIsDialogOpen(false);
  };

  const syncWithStripe = async () => {
    if (!session) {
      toast.error('Sessão expirada');
      return;
    }

    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-stripe-plans', {
        body: { plans },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      setPlans(data.plans);
      toast.success('Planos sincronizados com Stripe com sucesso!');
    } catch (error) {
      console.error('Error syncing with Stripe:', error);
      toast.error('Erro ao sincronizar com Stripe');
    } finally {
      setSyncing(false);
    }
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(p => p.id !== planId));
    toast.success('Plano removido com sucesso!');
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Gratuito' : `R$ ${price.toFixed(2)}`;
  };

  if (profile?.user_type !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gerenciar Planos</h1>
          <div className="flex gap-2">
            <Button 
              onClick={syncWithStripe}
              disabled={syncing}
              variant="outline"
            >
              {syncing ? 'Sincronizando...' : 'Sincronizar com Stripe'}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingPlan(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Plano
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure os detalhes do plano de assinatura
                  </DialogDescription>
                </DialogHeader>
                <PlanForm 
                  plan={editingPlan} 
                  onSave={handleSavePlan}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Voltar ao Painel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Planos para Clientes</CardTitle>
              <CardDescription>Gerencie os planos disponíveis para clientes</CardDescription>
            </CardHeader>
            <CardContent>
                  <div className="space-y-4">
                {plans.filter(p => p.user_type === 'client').map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatPrice(plan.price)}{plan.period}
                      </div>
                      {plan.stripe_product_id && (
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Sincronizado com Stripe
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={plan.active ? "default" : "secondary"}>
                        {plan.active ? "Ativo" : "Inativo"}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingPlan(plan);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planos para Profissionais</CardTitle>
              <CardDescription>Gerencie os planos disponíveis para profissionais</CardDescription>
            </CardHeader>
            <CardContent>
                  <div className="space-y-4">
                {plans.filter(p => p.user_type === 'professional').map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatPrice(plan.price)}{plan.period}
                      </div>
                      {plan.stripe_product_id && (
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Sincronizado com Stripe
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={plan.active ? "default" : "secondary"}>
                        {plan.active ? "Ativo" : "Inativo"}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingPlan(plan);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

interface PlanFormProps {
  plan: Plan | null;
  onSave: (plan: Plan) => void;
  onCancel: () => void;
}

function PlanForm({ plan, onSave, onCancel }: PlanFormProps) {
  const [formData, setFormData] = useState<Plan>(
    plan || {
      id: '',
      name: '',
      price: 0,
      period: '/mês',
      description: '',
      features: [],
      user_type: 'professional',
      limitations: {},
      active: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Plano</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Preço</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {plan ? 'Atualizar' : 'Criar'} Plano
        </Button>
      </div>
    </form>
  );
}