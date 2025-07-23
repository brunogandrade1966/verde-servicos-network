import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  created_at: string;
  client_profile?: {
    name: string;
  };
  service?: {
    name: string;
  };
}

const AdminProjects = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client_profile:profiles!projects_client_id_fkey(name),
          service:services(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_profile?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && project.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { label: 'Rascunho', className: 'bg-gray-100 text-gray-800' },
      'open': { label: 'Aberto', className: 'bg-green-100 text-green-800' },
      'in_progress': { label: 'Em Andamento', className: 'bg-blue-100 text-blue-800' },
      'completed': { label: 'Concluído', className: 'bg-purple-100 text-purple-800' },
      'cancelled': { label: 'Cancelado', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Projetos</h1>
          <p className="text-gray-600">Visualize e gerencie todos os projetos da plataforma</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar por título ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Projetos ({filteredProjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Título</th>
                      <th className="text-left p-2">Cliente</th>
                      <th className="text-left p-2">Serviço</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Orçamento</th>
                      <th className="text-left p-2">Prazo</th>
                      <th className="text-left p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{project.title}</td>
                        <td className="p-2">{project.client_profile?.name || 'N/A'}</td>
                        <td className="p-2">{project.service?.name || 'N/A'}</td>
                        <td className="p-2">{getStatusBadge(project.status)}</td>
                        <td className="p-2">
                          {project.budget_min && project.budget_max 
                            ? `R$ ${project.budget_min} - R$ ${project.budget_max}`
                            : 'N/A'
                          }
                        </td>
                        <td className="p-2">
                          {project.deadline 
                            ? new Date(project.deadline).toLocaleDateString('pt-BR')
                            : 'N/A'
                          }
                        </td>
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/projects/${project.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProjects.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Nenhum projeto encontrado.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;