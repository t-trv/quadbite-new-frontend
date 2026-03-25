import AppHeader from '@/components/header/AppHeader';
import BaseHeader from '@/components/header/BaseHeader';
import AppSidebar from '@/components/sidebar/AppSidebar';
import BaseSidebar from '@/components/sidebar/BaseSidebar';
import { SidebarProvider } from '@/contexts/SidebarProvider';
import SidebarContent from '@/components/sidebar/SidebarContent';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <BaseHeader>
          <AppHeader />
        </BaseHeader>
        <div className="flex">
          <BaseSidebar>
            <AppSidebar />
          </BaseSidebar>
          <SidebarContent>{children}</SidebarContent>
        </div>
      </SidebarProvider>
    </>
  );
}
