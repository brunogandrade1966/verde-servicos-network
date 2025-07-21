import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/layout/AdminLayout';
import { Activity, Clock, Users, FileText } from 'lucide-react';

export default function AdminActivity() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.user_type !== 'admin') {
      navigate('/dashboard');
      return;
    }
  }, [profile, navigate]);

  if (profile?.user_type !== 'admin') {
    return null;
  }

  const activities = [
    {
      id: 1,
      type: 'user_signup',
      description: 'Novo usuário registrado',
      user: 'João Silva',
      timestamp: '2 minutos atrás',
      icon: Users
    },
    {
      id: 2,
      type: 'project_created',
      description: 'Novo projeto criado',
      user: 'Maria Santos',
      timestamp: '15 minutos atrás',
      icon: FileText
    },
    {
      id: 3,
      type: 'subscription',
      description: 'Nova assinatura ativada',
      user: 'Pedro Costa',
      timestamp: '1 hora atrás',
      icon: Activity
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Atividades do Sistema</h1>
          <Badge variant="outline">Tempo Real</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>Últimas atividades registradas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">por {activity.user}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {activity.timestamp}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-sm text-muted-foreground">ações registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usuários Online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">43</div>
              <p className="text-sm text-muted-foreground">usuários ativos agora</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projetos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-sm text-muted-foreground">em andamento</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}