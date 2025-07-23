import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: {
    name: string;
  };
  reviewed?: {
    name: string;
  };
  project?: {
    title: string;
  };
}

const AdminReviews = () => {
  const { profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  if (profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(name),
          reviewed:profiles!reviews_reviewed_id_fkey(name),
          project:projects(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.reviewer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewed?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.project?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (ratingFilter === 'all') return matchesSearch;
    return matchesSearch && review.rating.toString() === ratingFilter;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    if (rating >= 3) return <Badge className="bg-yellow-100 text-yellow-800">Bom</Badge>;
    if (rating >= 2) return <Badge className="bg-orange-100 text-orange-800">Regular</Badge>;
    return <Badge className="bg-red-100 text-red-800">Ruim</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Avaliações</h1>
          <p className="text-gray-600">Visualize e modere avaliações da plataforma</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar por avaliador, avaliado ou projeto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Notas</SelectItem>
              <SelectItem value="5">5 Estrelas</SelectItem>
              <SelectItem value="4">4 Estrelas</SelectItem>
              <SelectItem value="3">3 Estrelas</SelectItem>
              <SelectItem value="2">2 Estrelas</SelectItem>
              <SelectItem value="1">1 Estrela</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Avaliações ({filteredReviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">
                            {review.reviewer?.name} → {review.reviewed?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Projeto: {review.project?.title || 'N/A'}
                          </p>
                        </div>
                        {getRatingBadge(review.rating)}
                      </div>
                      <div className="text-right">
                        {renderStars(review.rating)}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(review.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    {review.comment && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        "{review.comment}"
                      </div>
                    )}
                  </div>
                ))}
                {filteredReviews.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhuma avaliação encontrada.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;