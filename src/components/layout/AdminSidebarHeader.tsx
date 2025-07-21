import { Shield, Settings } from 'lucide-react';
import { SidebarHeader } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const AdminSidebarHeader = () => {
  return (
    <SidebarHeader className="border-b border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className="bg-red-100 p-2 rounded-lg">
          <Shield className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          <Badge variant="destructive" className="text-xs">
            Ambiental Partners
          </Badge>
        </div>
      </div>
    </SidebarHeader>
  );
};

export default AdminSidebarHeader;