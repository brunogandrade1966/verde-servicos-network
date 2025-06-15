
import { Leaf } from 'lucide-react';
import { SidebarHeader } from '@/components/ui/sidebar';

const ClientSidebarHeader = () => {
  return (
    <SidebarHeader className="p-6 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">Ambiental</h2>
          <p className="text-xs text-gray-500">Partners</p>
        </div>
      </div>
    </SidebarHeader>
  );
};

export default ClientSidebarHeader;
