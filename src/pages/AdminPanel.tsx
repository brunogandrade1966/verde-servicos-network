import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, TrendingUp, Activity, Settings, UserPlus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';

interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalApplications: number;
  totalSubscribers: number;
  monthlyRevenue: number;
}

export default function AdminPanel() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProjects: 0,
    totalApplications: 0,
    totalSubscribers: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.user_type !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    loadStats();
  }, [profile, navigate]);

  const loadStats = async () => {
    try {
      const [usersRes, projectsRes, applicationsRes, subscribersRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('applications').select('id', { count: 'exact' }),
        supabase.from('subscribers').select('subscribed', { count: 'exact' }).eq('subscribed', true)
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalProjects: projectsRes.count || 0,
        totalApplications: applicationsRes.count || 0,
        totalSubscribers: subscribersRes.count || 0,
        monthlyRevenue: 0 // Implementar cálculo de receita
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.user_type !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <Badge variant="outline">Ambiental Partners</Badge>
        </div>

        {/* KPIs Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Todos os usuários registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">Projetos criados na plataforma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidaturas</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">Total de candidaturas enviadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
              <p className="text-xs text-muted-foreground">Usuários com planos pagos</p>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Gerenciamento da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/admin/users')}
                variant="outline"
                className="h-20 flex-col"
              >
                <Users className="h-6 w-6 mb-2" />
                Gerenciar Usuários
              </Button>
              
              <Button 
                onClick={() => navigate('/admin/services')}
                variant="outline"
                className="h-20 flex-col"
              >
                <Settings className="h-6 w-6 mb-2" />
                Gerenciar Serviços
              </Button>
              
              <Button 
                onClick={() => navigate('/admin/plans')}
                variant="outline"
                className="h-20 flex-col"
              >
                <DollarSign className="h-6 w-6 mb-2" />
                Gerenciar Planos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>Monitoramento da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Sistema de Notificações</span>
                <Badge variant="default">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Processamento de Pagamentos</span>
                <Badge variant="default">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Sistema de Mensagens</span>
                <Badge variant="default">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Backup de Dados</span>
                <Badge variant="secondary">Última execução: Hoje</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}