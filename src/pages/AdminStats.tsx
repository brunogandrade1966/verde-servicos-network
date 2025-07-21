import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/layout/AdminLayout';
import { BarChart3, Users, Activity, TrendingUp } from 'lucide-react';

export default function AdminStats() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.user_type !== 'admin') {
      navigate('/dashboard');
      return;
    }
    setLoading(false);
  }, [profile, navigate]);

  if (profile?.user_type !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Estatísticas Detalhadas</h1>
          <Badge variant="outline">Sistema de Analytics</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Crescimento de Usuários
              </CardTitle>
              <CardDescription>Novos usuários por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23%</div>
              <p className="text-sm text-muted-foreground">vs. mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Taxa de Engajamento
              </CardTitle>
              <CardDescription>Usuários ativos diários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-sm text-muted-foreground">dos usuários registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Projetos Finalizados
              </CardTitle>
              <CardDescription>Taxa de conclusão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-sm text-muted-foreground">projetos concluídos com sucesso</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Métricas Avançadas</CardTitle>
            <CardDescription>Análises detalhadas do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Tempo médio de resposta</span>
                <Badge variant="secondary">1.2s</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Satisfação do cliente</span>
                <Badge variant="default">4.8/5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Receita recorrente mensal</span>
                <Badge variant="outline">R$ 25.000</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}