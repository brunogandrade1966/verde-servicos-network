
import {
  Sidebar,
  SidebarProvider,
  SidebarInset
} from '@/components/ui/sidebar';
import ClientSidebarHeader from './SidebarHeader';
import ClientSidebarFooter from './SidebarFooter';
import ClientSidebarContent from './SidebarContent';
import LayoutHeader from './LayoutHeader';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <ClientSidebarHeader />
          <ClientSidebarContent />
          <ClientSidebarFooter />
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

export default ClientLayout;
