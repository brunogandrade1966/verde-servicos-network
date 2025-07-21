import {
  Sidebar,
  SidebarProvider,
  SidebarInset
} from '@/components/ui/sidebar';
import AdminSidebarHeader from './AdminSidebarHeader';
import AdminSidebarFooter from './AdminSidebarFooter';
import AdminSidebarContent from './AdminSidebarContent';
import LayoutHeader from './LayoutHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <AdminSidebarHeader />
          <AdminSidebarContent />
          <AdminSidebarFooter />
        </Sidebar>

        <SidebarInset className="flex-1">
          <LayoutHeader />
          
          <main className="flex-1 p-4">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;