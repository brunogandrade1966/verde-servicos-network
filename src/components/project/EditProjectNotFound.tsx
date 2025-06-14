
import { Card, CardContent } from '@/components/ui/card';

export const EditProjectNotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Demanda não encontrada
            </h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
